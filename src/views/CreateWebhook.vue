<template>
  <q-page class="create-page q-pa-md">
    <h6>Webhook新規作成</h6>
    <q-form
      class="create-form"
      @submit="onSubmit"
    >
      <q-banner
        class="app-warning-banner"
        rounded
      >
        <template #avatar>
          <q-icon
            class="text-orange"
            name="warning"
          />
        </template>
        <router-link to="/docs/webhook">
          Webhookマニュアル
        </router-link>と
        <router-link to="/docs/webhook/rule">
          Webhook利用ルール
        </router-link>をよく読んでから使用してください。
      </q-banner>
      <q-input
        v-model="name"
        outlined
        stack-label
        label="Webhook名(表示名)"
        counter
        maxlength="32"
        :rules="[val => val && val.length > 0 || '必須項目です']"
        hint="Webhookが投稿したメッセージに表示されます"
      />
      <q-input
        v-model="description"
        outlined
        autogrow
        stack-label
        label="説明"
        type="textarea"
        hint="使用用途等を入力してください"
        :rules="[val => val && val.length > 0 || '必須項目です']"
      />
      <q-select
        v-model="targetChannel"
        outlined
        clearable
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
        hint="プライベートなチャンネルは指定できません"
        @filter="channelFilterFn"
      >
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey">
              チャンネルが表示されない場合は右の更新ボタンを押してください
            </q-item-section>
          </q-item>
        </template>
        <template #after>
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
        v-model="secret"
        outlined
        stack-label
        label="Webhookシークレット"
        hint="Secure Webhookを使用しない場合は空欄にしてください。シークレットは後から見ることはできないので、記録しておいてください。"
      />
      <q-checkbox
        v-model="accept"
        label="Webhook利用ルールに同意する"
      />
      <div class="create-actions">
        <q-btn
          label="作成"
          color="primary"
          type="submit"
          unelevated
        />
      </div>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useStore } from '../store'
import { traq } from '../api'

defineOptions({ name: 'CreateWebhook' })

const $q = useQuasar()
const router = useRouter()
const store = useStore()

const name = ref('')
const description = ref('')
const targetChannel = ref<any>(null)
const channelOptions = ref<any[]>([])
const secret = ref('')
const accept = ref(false)
const loadingChannel = ref(false)
const getChannelArray = computed(() => store.channelArray)

const fetchChannels = async () => {
  loadingChannel.value = true
  try {
    targetChannel.value = null
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

onMounted(() => {
  fetchChannels()
})

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

const onSubmit = async () => {
  if (accept.value !== true) {
    $q.notify({
      icon: 'error_outline',
      color: 'red-5',
      textColor: 'white',
      message: 'Webhook利用ルールに同意する必要があります'
    })
  } else {
    $q.loading.show({ delay: 400 })
    try {
      const res = await traq.createWebhook({
        name: name.value,
        description: description.value,
        channelId: targetChannel.value.id,
        secret: secret.value
      })
      await router.push(`/webhooks/${res.data.id}`)
      $q.notify({
        icon: 'done',
        color: 'primary',
        textColor: 'white',
        message: 'Webhookが作成されました'
      })
    } catch (e: any) {
      console.error(e)
      $q.notify({
        icon: 'error_outline',
        color: 'red-5',
        textColor: 'white',
        message: '作成時にエラーが発生しました'
      })
    } finally {
      $q.loading.hide()
    }
  }
}
</script>
