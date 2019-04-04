<template lang="pug">
  q-page.q-pa-md.q-gutter-sm
    h6 Webhookテスター
      p.text-caption 以下に指定した内容で実際にWebhookを送信します。
    q-form.q-gutter-md(@submit="onSubmit")
      q-input(v-model="webhookId" outlined stack-label label="Webhook ID" :rules="[val => val && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val) || 'Webhook IDを入力してください']")
      q-input(v-model="webhookSecret" outlined stack-label label="Webhookシークレット" hint="Secure Webhookを使用しない場合は空欄にしてください")
      q-input(v-model="message" ref="message" outlined height="300px" stack-label label="メッセージ本体" type="textarea" :rules="[val => val && val.length > 0 || '必須項目です']")
      div
        q-btn.float-right(label="送信" color="primary" type="submit" unelevated)
</template>

<script>
import { postWebhookMessage } from '../api'

export default {
  name: 'WebhookTester',
  data () {
    return {
      webhookId: '',
      webhookSecret: '',
      message: ''
    }
  },
  mounted () {
    if (this.$route.query.id) {
      this.webhookId = this.$route.query.id
    }
  },
  methods: {
    async onSubmit () {
      this.$q.loading.show({ delay: 400 })
      try {
        await postWebhookMessage(this.webhookId, this.message, this.webhookSecret)
        this.$q.notify({
          icon: 'done',
          color: 'primary',
          textColor: 'white',
          message: '送信に成功しました'
        })
        this.message = ''
        this.$nextTick(() => {
          this.$refs.message.resetValidation()
        })
      } catch (e) {
        console.error(e)
        this.$q.notify({
          icon: 'error_outline',
          color: 'red-5',
          textColor: 'white',
          message: '正常に送信できませんでした'
        })
      } finally {
        this.$q.loading.hide()
      }
    }
  }
}
</script>
