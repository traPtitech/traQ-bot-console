<template>
  <q-page class="q-pa-md q-gutter-md">
    <template v-if="webhook === null">
      <q-skeleton
        tag="h6"
        type="text"
      />
      <div class="q-gutter-md">
        <div class="row q-col-gutter-md">
          <div class="col col-md-2 col-sm-3">
            <div class="row">
              <span class="col-4 col-sm-12">
                <q-skeleton
                  type="rect"
                  style="height: 6em"
                /></span>
              <div class="col-5 col-md-12 col-sm-12 q-pa-md">
                <q-skeleton type="rect" />
              </div>
            </div>
          </div>
          <div class="col-12 col-md-10 col-sm-9">
            <q-skeleton
              type="rect"
              style="height: 40em"
            />
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <h6>{{ webhook.displayName }} Webhookの詳細</h6>
      <div class="q-gutter-md">
        <div class="row q-col-gutter-md">
          <div class="col col-md-2 col-sm-3">
            <div class="row">
              <span class="col-4 col-sm-12">
                <q-file
                  v-if="editingIcon"
                  v-model="iconFile"
                  label="2MBまでのpng,jpg,gif"
                  flat
                  style="max-width: 100%"
                  accept="image/jpeg, image/png, image/gif"
                />
                <q-img
                  v-else
                  :src="getUserIconURL(webhook.botUserName)"
                /></span>
              <div class="col-5 col-md-12 col-sm-12 q-pa-md q-gutter-sm">
                <q-btn
                  v-if="editingIcon"
                  class="full-width"
                  unelevated
                  color="primary"
                  :disable="iconFile === null"
                  :loading="uploadingIcon"
                  @click="uploadIcon"
                >
                  アップロード
                </q-btn>
                <q-btn
                  class="full-width"
                  unelevated
                  color="grey"
                  @click="toggleIconEditing"
                >
                  {{ editingIcon ? 'キャンセル' : 'アイコン変更' }}
                </q-btn>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-10 col-sm-9">
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
                label="情報"
              />
              <q-tab
                name="messages"
                label="投稿メッセージ"
              />
            </q-tabs>
            <q-separator />
            <q-tab-panels
              v-model="tab"
              animated
            >
              <q-tab-panel name="info">
                <div>
                  <q-badge
                    v-if="webhook.secure"
                    color="blue"
                  >
                    Secure Webhook
                  </q-badge>
                  <q-badge
                    v-else
                    color="red"
                  >
                    Insecure Webhook
                  </q-badge>
                </div>
                <q-form
                  class="col"
                  @submit="onSubmit"
                >
                  <q-input
                    v-model="webhook.id"
                    label="Webhook ID"
                    readonly
                    hint=""
                  >
                    <template #after>
                      <q-icon
                        class="cursor-pointer"
                        name="file_copy"
                        @click="copyText(webhook.id)"
                      />
                    </template>
                  </q-input>
                  <q-input
                    v-model="webhook.botUserId"
                    label="Webhook User ID"
                    readonly
                    hint=""
                  />
                  <q-input
                    v-model="name.value"
                    label="Webhook名"
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
                  <q-select
                    ref="channelSelect"
                    v-model="channel.value"
                    :readonly="!editing"
                    :clearable="editing"
                    use-input
                    hide-selected
                    fill-input
                    input-debounce="0"
                    stack-label
                    label="投稿先チャンネル"
                    :options="channelOptions"
                    option-value="channelName"
                    option-label="channelName"
                    :rules="[val => val || '必須項目です']"
                    :loading="loadingChannel"
                    :disable="loadingChannel"
                    @filter="channelFilterFn"
                  >
                    <template #no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          チャンネルが表示されない場合は右の更新ボタンを押してください
                        </q-item-section>
                      </q-item>
                    </template>
                    <template
                      v-if="editing"
                      #after
                    >
                      <q-btn
                        round
                        dense
                        flat
                        icon="refresh"
                        @click="fetchChannels"
                      />
                    </template>
                  </q-select>
                  <q-input
                    v-model="secret.value"
                    stack-label
                    label="Webhookシークレット"
                    :readonly="!editing"
                    hide-hint
                    hint="Webhookシークレットを変更する場合は左のチェックを入れてください"
                  >
                    <template
                      v-if="editing"
                      #before
                    >
                      <q-checkbox v-model="secret.editing" />
                    </template>
                  </q-input>
                  <q-input
                    v-if="webhook.ownerId !== userInfo.id"
                    v-model="webhook.ownerName"
                    label="作成者"
                    hint=""
                    readonly
                  />
                  <q-input
                    :model-value="formatDateTime(webhook.createdAt)"
                    label="作成日時"
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
                    color="primary"
                    unelevated
                    :to="`/webhooks/tester?id=${webhook.id}`"
                  >
                    テスト
                  </q-btn>
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
              <q-tab-panel name="messages">
                このWebhookが投稿した最新のメッセージ10件を見ることができます。
                <q-list separator>
                  <q-item
                    v-for="m in messages"
                    :key="m.id"
                  >
                    <q-item-section>
                      <q-item-label>{{ getChannel(m.channelId)?.channelName ?? m.channelId }}</q-item-label>
                      <q-item-label
                        caption
                        style="white-space:pre-wrap; word-wrap:break-word;"
                      >
                        {{ m.content }}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section
                      side
                      top
                    >
                      <q-item-label caption>
                        {{ formatDateTime(m.createdAt) }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
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
import { useStore } from '../store'
import { traq, getUserIconURL, getUsersOptionItems } from '../api'
import { formatDateTime } from '../utils'

const iconMaxFileSize = 2048 * 1024
const iconAcceptTypes = ['image/jpeg', 'image/png', 'image/gif']

defineOptions({ name: 'WebhookDetail' })

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const store = useStore()

const loading = ref(false)
const tab = ref('info')
const webhook = ref<any>(null)
const loadingChannel = ref(false)
const channelOptions = ref<any[]>([])
const editing = ref(false)
const editingIcon = ref(false)
const iconFile = ref<any>(null)
const uploadingIcon = ref(false)
const name = reactive({ value: '', temp: '' })
const description = reactive({ value: '', temp: '' })
const channel = reactive<any>({ value: null, temp: null })
const secret = reactive({ value: '表示されません', editing: false })
const messages = ref<any[]>([])
const channelSelect = ref<any>(null)
const getChannelArray = computed(() => store.channelArray)
const getChannel = (id: string) => store.channelById(id)
const userInfo = computed<any>(() => store.userInfo)

const fetchData = async () => {
  loading.value = true
  webhook.value = null
  try {
    const webhookData: any = (await traq.getWebhook((route.params as any).id as string)).data
    webhookData.botUserName = await store.fetchUserName(webhookData.botUserId)
    webhookData.ownerName = await store.fetchUserName(webhookData.ownerId)
    name.value = webhookData.displayName
    description.value = webhookData.description
    webhook.value = webhookData
    channel.value = store.channelById(webhookData.channelId)
    if (channel.value === null || channel.value === undefined) {
      await store.updateChannelList()
      channel.value = store.channelById(webhookData.channelId)
    }
    messages.value = (await traq.getWebhookMessages((route.params as any).id as string, 10)).data
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

const fetchChannels = async () => {
  loadingChannel.value = true
  try {
    channel.value = null
    await store.updateChannelList()
  } catch (e: any) {
    console.error(e)
    $q.notify({
      icon: 'error_outline',
      color: 'red-5',
      textColor: 'white',
      message: '更新時にエラーが発生しました'
    })
  } finally {
    loadingChannel.value = false
  }
}

const channelFilterFn = (val: string, update: (callback: () => void) => void) => {
  if (val === '') {
    update(() => { channelOptions.value = getChannelArray.value })
  } else {
    update(() => {
      const l = val.toLowerCase()
      channelOptions.value = getChannelArray.value.filter(v => v.channelName.toLowerCase().indexOf(l) > -1)
    })
  }
}

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
      await traq.deleteWebhook(webhook.value.id)
      await router.push('/webhooks')
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
  const items = await getUsersOptionItems(webhook.value.ownerId)
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
        await traq.editWebhook(webhook.value.id, { ownerId: user.id })
        await router.push('/webhooks')
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
  channel.temp = channel.value
  secret.value = ''
  secret.editing = false
  editing.value = true
}

const cancelEditing = () => {
  name.value = name.temp
  description.value = description.temp
  channel.value = channel.temp
  channelSelect.value?.updateInputValue(channel.value?.channelName ?? '')
  secret.value = '表示されません'
  secret.editing = false
  editing.value = false
}

const onSubmit = async () => {
  $q.loading.show({ delay: 400 })
  try {
    const params: Record<string, any> = {
      name: name.value,
      description: description.value,
      channelId: channel.value.id
    }
    if (secret.editing) {
      params['secret'] = secret.value
    }
    await traq.editWebhook(webhook.value.id, params)
    await fetchData()
    $q.notify({
      icon: 'done',
      color: 'primary',
      textColor: 'white',
      message: 'Webhookが編集されました'
    })
    secret.value = '表示されません'
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

const toggleIconEditing = () => {
  editingIcon.value = !editingIcon.value
  iconFile.value = null
}

const validateIconFile = () => {
  if (iconFile.value === null) {
    return false
  }
  if (!iconAcceptTypes.includes(iconFile.value.type)) {
    $q.notify({
      icon: 'error_outline',
      color: 'red-5',
      textColor: 'white',
      message: 'png,jpg,gifのいずれかを選択してください'
    })
    return false
  }
  if (iconFile.value.size > iconMaxFileSize) {
    $q.notify({
      icon: 'error_outline',
      color: 'red-5',
      textColor: 'white',
      message: '2MB以下のファイルを選択してください'
    })
    return false
  }
  return true
}

const onUploadIconSuccess = () => {
  editingIcon.value = false
  iconFile.value = null
  $q.notify({
    icon: 'done',
    color: 'primary',
    textColor: 'white',
    message: 'アイコンが変更されました。\nBOT Console上では、アイコン画像キャッシュの有効期限が切れた後に表示が反映されます。'
  })
}

const onUploadIconFailed = () => {
  $q.notify({
    icon: 'error_outline',
    color: 'red-5',
    textColor: 'white',
    message: 'アイコンの変更でエラーが発生しました'
  })
}

const uploadIcon = async () => {
  if (!validateIconFile()) {
    return
  }
  uploadingIcon.value = true
  try {
    await traq.changeWebhookIcon(webhook.value.id, iconFile.value)
    onUploadIconSuccess()
  } catch (e: any) {
    console.error(e)
    onUploadIconFailed()
  } finally {
    uploadingIcon.value = false
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
