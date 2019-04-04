<template lang="pug">
  q-page
    q-list(bordered v-if="!loading" separator)
      q-item-label(header) 作成したWebhook一覧

      q-item(v-for="wh in webhooks" :key="wh.webhookId" clickable :to="`/webhooks/${wh.webhookId}`")
        q-item-section(avatar)
          q-avatar
            img(:src="getUserIconURL(wh.botUserName)")
        q-item-section
          q-item-label {{ wh.displayName }}
          q-item-label(caption lines="1") {{ wh.description }}

    div.q-pa-md
      q-btn.full-width(color="primary" unelevated to="/webhooks/create") 新規作成

</template>

<script>
import { getWebhooks, getUserIconURL } from '../api'

export default {
  name: 'Webhooks',
  data () {
    return {
      loading: false,
      webhooks: []
    }
  },
  async mounted () {
    await this.getWebhooks()
  },
  methods: {
    async getWebhooks () {
      this.loading = true
      this.$q.loading.show({ delay: 400 })
      try {
        const res = await getWebhooks()
        for (let wh of res.data) {
          wh.botUserName = await this.$store.dispatch('fetchUserName', wh.botUserId)
        }
        this.webhooks = res.data
      } catch (e) {
        console.error(e)
        this.$q.notify({
          icon: 'error_outline',
          color: 'red-5',
          textColor: 'white',
          message: '一覧の取得時にエラーが発生しました'
        })
      } finally {
        this.loading = false
        this.$q.loading.hide()
      }
    },
    getUserIconURL
  }
}
</script>
