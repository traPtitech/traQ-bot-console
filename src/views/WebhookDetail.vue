<template lang="pug">
  q-page.q-pa-md.q-gutter-sm
    template(v-if="webhook !== null")
      h6 {{ webhook.displayName }} Webhookの詳細
      q-btn.full-width(color="negative" unelevated @click="onDeleteBtnClicked") 削除

    template(v-else)
      span 読み込み中...
</template>

<script>
import { getWebhook, deleteWebhook } from '../api'

export default {
  name: 'WebhookDetail',
  data () {
    return {
      loading: false,
      webhook: null
    }
  },
  async created () {
    await this.fetchData()
  },
  watch: {
    '$route': 'fetchData'
  },
  methods: {
    async fetchData () {
      this.loading = true
      this.webhook = null
      this.$q.loading.show({ delay: 400 })
      try {
        const res = await getWebhook(this.$route.params.id)
        this.webhook = res.data
      } catch (e) {
        console.error(e)
        this.$q.notify({
          icon: 'error_outline',
          color: 'red-5',
          textColor: 'white',
          message: '取得時にエラーが発生しました'
        })
      } finally {
        this.loading = false
        this.$q.loading.hide()
      }
    },
    onDeleteBtnClicked () {
      this.$q.dialog({
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
        this.$q.loading.show({ delay: 400 })
        try {
          await deleteWebhook(this.webhook.webhookId)
          this.$router.push('/webhooks', () => {
            this.$q.notify({
              icon: 'done',
              color: 'primary',
              textColor: 'white',
              message: '削除に成功しました'
            })
          })
        } catch (e) {
          console.error(e)
          this.$q.notify({
            icon: 'error_outline',
            color: 'red-5',
            textColor: 'white',
            message: '削除時にエラーが発生しました'
          })
        } finally {
          this.$q.loading.hide()
        }
      })
    }
  }
}
</script>
