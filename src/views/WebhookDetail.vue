<template lang="pug">
  q-page.q-pa-md.q-gutter-sm
    template(v-if="webhook !== null")
      h6 {{ webhook.displayName }} Webhookの詳細

    template(v-else)
      span 読み込み中...
</template>

<script>
import { getWebhook } from '../api'

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
    }
  }
}
</script>
