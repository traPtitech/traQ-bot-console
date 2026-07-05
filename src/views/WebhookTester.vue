<template>
  <q-page class="q-pa-md q-gutter-sm">
    <h6>
      Webhookテスター
      <p class="text-caption">
        以下に指定した内容で実際にWebhookを送信します。
      </p>
    </h6>
    <q-form
      class="q-gutter-md"
      @submit="onSubmit"
    >
      <q-input
        v-model="id"
        outlined
        stack-label
        label="Webhook ID"
        :rules="[val => val && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val) || 'Webhook IDを入力してください']"
      />
      <q-input
        v-model="webhookSecret"
        outlined
        stack-label
        label="Webhookシークレット"
        hint="Secure Webhookを使用しない場合は空欄にしてください"
      />
      <q-input
        ref="messageInput"
        v-model="message"
        outlined
        height="300px"
        stack-label
        label="メッセージ本体"
        type="textarea"
        :rules="[val => val && val.length > 0 || '必須項目です']"
      />
      <div>
        <q-btn
          class="float-right"
          label="送信"
          color="primary"
          type="submit"
          unelevated
        />
      </div>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { postWebhookMessage } from '../api'

defineOptions({ name: 'WebhookTester' })

const $q = useQuasar()
const route = useRoute()

const id = ref('')
const webhookSecret = ref('')
const message = ref('')
const messageInput = ref<any>(null)

onMounted(() => {
  const queryId = route.query['id']
  if (queryId) {
    id.value = Array.isArray(queryId) ? queryId[0] ?? '' : queryId
  }
})

const onSubmit = async () => {
  $q.loading.show({ delay: 400 })
  try {
    await postWebhookMessage(id.value, message.value, webhookSecret.value)
    $q.notify({
      icon: 'done',
      color: 'primary',
      textColor: 'white',
      message: '送信に成功しました'
    })
    message.value = ''
    await nextTick()
    messageInput.value?.resetValidation()
  } catch (e: any) {
    console.error(e)
    $q.notify({
      icon: 'error_outline',
      color: 'red-5',
      textColor: 'white',
      message: '正常に送信できませんでした'
    })
  } finally {
    $q.loading.hide()
  }
}
</script>
