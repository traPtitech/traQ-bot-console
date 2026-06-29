<template>
  <q-page class="q-pa-md q-gutter-md">
    <template v-if="client === null">
      <q-skeleton
        tag="h6"
        type="text"
      />
      <div class="q-gutter-md">
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <q-skeleton
              type="rect"
              style="height: 40em"
            />
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <h6>{{ client.name }} Clientの詳細</h6>
      <div class="q-gutter-md">
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <q-tabs
              v-model="tab"
              class="text-grey"
              dense
              active-color="primary"
              indicator-color="primary"
              narrow-indicator
              align="left"
            >
              <q-tab
                name="info"
                label="基本情報"
              />
              <q-tab
                name="cred"
                label="認証情報"
              />
            </q-tabs>
            <q-separator />
            <q-tab-panels
              v-model="tab"
              animated
            >
              <q-tab-panel name="info">
                <q-form
                  class="col"
                  @submit="onSubmit"
                >
                  <q-input
                    v-model="client.id"
                    label="Client ID"
                    readonly
                    hint=""
                  >
                    <template #after>
                      <q-icon
                        class="cursor-pointer"
                        name="file_copy"
                        @click="copyText(client.id)"
                      />
                    </template>
                  </q-input>
                  <q-input
                    v-model="name.value"
                    label="Client名"
                    stack-label
                    :readonly="!editing"
                    :counter="editing"
                    maxlength="32"
                    :rules="[val => val && val.length > 0 || '必須項目です']"
                  />
                  <q-input
                    v-model="description.value"
                    label="説明"
                    stack-label
                    :readonly="!editing"
                    type="textarea"
                    autogrow
                    :rules="[val => val && val.length > 0 || '必須項目です']"
                  />
                  <q-input
                    v-model="callbackUrl.value"
                    label="リダイレクト先URL"
                    stack-label
                    :readonly="!editing"
                    :counter="editing"
                    :rules="[val => val && urlRegex.test(val) || '有効なURLを入力してください']"
                  />
                  <fieldset class="scope-field">
                    <legend>スコープ</legend>
                    <q-option-group
                      v-model="client.scopes"
                      :options="scopeOptions"
                      type="checkbox"
                      disable
                    />
                  </fieldset>
                  <q-input
                    v-if="client.developerId !== userInfo.id"
                    v-model="client.developerName"
                    label="作成者"
                    hint=""
                    readonly
                  />
                  <div
                    v-if="editing"
                    class="row q-gutter-sm"
                  >
                    <q-btn
                      class="col btn-fixed-width"
                      label="キャンセル"
                      unelevated
                      @click="cancelEditing"
                    />
                    <q-btn
                      class="col btn-fixed-width"
                      label="送信"
                      color="primary"
                      type="submit"
                      unelevated
                    />
                  </div>
                </q-form>
                <div
                  v-if="!editing"
                  class="row q-gutter-sm"
                >
                  <q-btn
                    class="col btn-fixed-width"
                    color="secondary"
                    unelevated
                    @click="startEditing"
                  >
                    編集
                  </q-btn>
                  <q-btn
                    class="col btn-fixed-width"
                    color="negative"
                    unelevated
                    @click="onDeleteBtnClicked"
                  >
                    削除
                  </q-btn>
                  <q-btn
                    class="col btn-fixed-width"
                    color="warning"
                    unelevated
                    @click="onTransferBtnClicked"
                  >
                    移譲
                  </q-btn>
                </div>
              </q-tab-panel>
              <q-tab-panel name="cred">
                <p>以下の認証情報の取り扱いに十分注意してください</p>
                <q-form>
                  <q-input
                    v-model="client.secret"
                    label="Client Secret"
                    :type="hideSecret ? 'password' : 'text'"
                    readonly
                  >
                    <template #after>
                      <q-icon
                        class="cursor-pointer"
                        name="file_copy"
                        :class="{ hidden: hideSecret }"
                        @click="copyText(client.secret)"
                      />
                      <q-icon
                        class="cursor-pointer"
                        :name="hideSecret ? 'visibility_off' : 'visibility'"
                        @click="hideSecret = !hideSecret"
                      />
                    </template>
                  </q-input>
                </q-form>
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
      </div>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { copyToClipboard, useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { traq, getUsersOptionItems } from '../api'
import clientScopeOptions from '../clientScopes'

defineOptions({ name: 'ClientDetail' })

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const store = useStore()

const loading = ref(false)
const tab = ref('info')
const client = ref<any>(null)
const editing = ref(false)
const name = reactive({ value: '', temp: '' })
const description = reactive({ value: '', temp: '' })
const callbackUrl = reactive({ value: '', temp: '' })
const scopeOptions = clientScopeOptions.map(opt => ({
  label: `${opt.label} (${opt.value})`,
  value: opt.value,
}))
const urlRegex = /http(s)?:\/\/([\w-]+.)+[\w-]+(\/[\w- ./?%&=]*)?/i
const hideSecret = ref(true)
const userInfo = computed<any>(() => store.state.userInfo)

const fetchData = async () => {
  loading.value = true
  client.value = null
  try {
    const clientData: any = (await traq.getClient((route.params as any).id as string, true)).data
    clientData.developerName = await store.dispatch('fetchUserName', clientData.developerId)
    name.value = clientData.name
    description.value = clientData.description
    callbackUrl.value = clientData.callbackUrl
    client.value = clientData
  } catch (e: any) {
    console.error(e)
    $q.notify({
      icon: 'error_outline',
      color: 'red-5',
      textColor: 'white',
      message: '取得時にエラーが発生しました'
    })
  } finally {
    loading.value = false
  }
}

watch(() => (route.params as any).id, fetchData, { immediate: true })

const onDeleteBtnClicked = () => {
  $q.dialog({
    title: '確認',
    message: '本当に削除しますか？',
    ok: {
      color: 'negative',
      unelevated: true
    },
    cancel: {
      unelevated: true
    },
    persistent: true
  }).onOk(async () => {
    $q.loading.show({ delay: 400 })
    try {
      await traq.deleteClient(client.value.id)
      await router.push('/clients')
      $q.notify({
        icon: 'done',
        color: 'primary',
        textColor: 'white',
        message: '削除に成功しました'
      })
    } catch (e: any) {
      console.error(e)
      $q.notify({
        icon: 'error_outline',
        color: 'red-5',
        textColor: 'white',
        message: '削除時にエラーが発生しました'
      })
    } finally {
      $q.loading.hide()
    }
  })
}

const onTransferBtnClicked = async () => {
  const items = await getUsersOptionItems(client.value.developerId)
  $q.dialog({
    title: '移譲',
    message: '誰に移譲しますか？',
    options: {
      type: 'radio',
      model: items[0]?.value as any,
      items
    } as any,
    cancel: true,
    persistent: true
  }).onOk(async user => {
    $q.dialog({
      title: '移譲',
      message: `本当に@${user.name}に移譲しますか？`,
      ok: {
        color: 'negative',
        unelevated: true
      },
      cancel: {
        unelevated: true
      },
      persistent: true
    }).onOk(async () => {
      $q.loading.show({ delay: 400 })
      try {
        await traq.editClient(client.value.id, { developerId: user.id })
        await router.push('/clients')
        $q.notify({
          icon: 'done',
          color: 'primary',
          textColor: 'white',
          message: '移譲に成功しました'
        })
      } catch (e: any) {
        console.error(e)
        $q.notify({
          icon: 'error_outline',
          color: 'red-5',
          textColor: 'white',
          message: '移譲時にエラーが発生しました'
        })
      } finally {
        $q.loading.hide()
      }
    })
  })
}

const startEditing = () => {
  name.temp = name.value
  description.temp = description.value
  callbackUrl.temp = callbackUrl.value
  editing.value = true
}

const cancelEditing = () => {
  name.value = name.temp
  description.value = description.temp
  callbackUrl.value = callbackUrl.temp
  editing.value = false
}

const onSubmit = async () => {
  $q.loading.show({ delay: 400 })
  try {
    const params = {
      name: name.value,
      description: description.value,
      callbackUrl: callbackUrl.value
    }
    await traq.editClient(client.value.id, params)
    await fetchData()
    $q.notify({
      icon: 'done',
      color: 'primary',
      textColor: 'white',
      message: 'Clientが編集されました'
    })
    editing.value = false
  } catch (e: any) {
    console.error(e)
    $q.notify({
      icon: 'error_outline',
      color: 'red-5',
      textColor: 'white',
      message: '送信時にエラーが発生しました'
    })
  } finally {
    $q.loading.hide()
  }
}

const copyText = async (str: string) => {
  try {
    await copyToClipboard(str)
    $q.notify({
      icon: 'done',
      color: 'primary',
      textColor: 'white',
      message: 'コピーしました'
    })
  } catch (e: any) {
    console.error('copy', e)
    $q.notify({
      icon: 'error_outline',
      color: 'red-5',
      textColor: 'white',
      message: 'コピーに失敗しました'
    })
  }
}
</script>
