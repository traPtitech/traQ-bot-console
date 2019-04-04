<template lang="pug">
  q-page 詳細

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
      this.$q.loading.show({ delay: 400 })
      try {
        const res = await getWebhook(this.$route.params.id)
        this.webhook = res.data
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
        this.$q.loading.hide()
      }
    }
  }
}
</script>
