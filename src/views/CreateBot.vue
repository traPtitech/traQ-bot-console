<template>
  <q-page class="create-page q-pa-md">
    <h6>BOT新規登録</h6>
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
        <router-link to="/docs/bot">
          BOTマニュアル
        </router-link>と
        <router-link to="/docs/bot/rule">
          BOT利用ルール
        </router-link>をよく読んでから使用してください。
      </q-banner>
      <q-input
        v-model="name"
        outlined
        stack-label
        label="BOT ID"
        counter
        maxlength="16"
        prefix="@BOT_"
        :rules="[val => val && botNameRegex.test(val) || '有効な文字列を入力してください']"
        hint="使用可能な文字はa-zA-Z0-9_-です。自動的に接頭辞`BOT_`が付与されます"
      />
      <q-input
        v-model="displayName"
        outlined
        stack-label
        label="BOT表示名"
        counter
        maxlength="32"
        :rules="[val => val && val.length > 0 || '必須項目です']"
        hint="BOTが投稿したメッセージに表示されます"
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
        v-model="mode"
        outlined
        stack-label
        label="動作モード"
        hint="動作モードを選択してください"
        :options="modeOptions"
        :rules="[val => val && modeOptions.includes(val) || '選択してください']"
      />
      <q-input
        v-if="mode === 'HTTP'"
        v-model="endpoint"
        outlined
        stack-label
        label="BOTサーバーエンドポイント"
        hint="traQのイベント送信先のURLを入力してください"
        :rules="[modeRule]"
        reactive-rules
      />
      <q-checkbox
        v-model="accept"
        label="BOT利用ルールに同意する"
      />
      <div class="create-actions">
        <q-btn
          label="登録"
          color="primary"
          type="submit"
          unelevated
        />
      </div>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { traq } from '../api'

defineOptions({ name: 'CreateBot' })

const $q = useQuasar()
const router = useRouter()

const name = ref('')
const displayName = ref('')
const description = ref('')
const mode = ref('')
const endpoint = ref('')
const accept = ref(false)
const modeOptions = ['HTTP', 'WebSocket']
const urlRegex = /http(s)?:\/\/([\w-]+.)+[\w-]+(\/[\w- ./?%&=]*)?/i
const botNameRegex = /^[a-zA-Z0-9_-]{1,16}$/i

const modeRule = computed(() => (val: string) => {
  if (mode.value === 'HTTP') {
    return (val && urlRegex.test(val)) || '有効なURLを入力してください'
  }
  return true
})

const onSubmit = async () => {
  if (accept.value !== true) {
    $q.notify({
      icon: 'error_outline',
      color: 'red-5',
      textColor: 'white',
      message: 'BOT利用ルールに同意する必要があります'
    })
  } else {
    $q.loading.show({ delay: 400 })
    try {
      const params: Record<string, any> = {
        name: name.value,
        displayName: displayName.value,
        description: description.value,
        mode: mode.value
      }
      if (mode.value === 'HTTP') {
        params['endpoint'] = endpoint.value
      }
      const res = await traq.createBot(params as any)
      await router.push(`/bots/${res.data.id}`)
      $q.notify({
        icon: 'done',
        color: 'primary',
        textColor: 'white',
        message: 'BOTが登録されました'
      })
    } catch (e: any) {
      if (e.response && e.response.status === 409) {
        $q.notify({
          icon: 'error_outline',
          color: 'red-5',
          textColor: 'white',
          message: '既に使われているIDです'
        })
      } else if (e.response && e.response.data.message === 'endpoint: must not be internal url.') {
        $q.notify({
          icon: 'error_outline',
          color: 'red-5',
          textColor: 'white',
          message: 'エンドポイントURLが無効です'
        })
      } else {
        console.error(e)
        $q.notify({
          icon: 'error_outline',
          color: 'red-5',
          textColor: 'white',
          message: '登録時にエラーが発生しました'
        })
      }
    } finally {
      $q.loading.hide()
    }
  }
}
</script>
