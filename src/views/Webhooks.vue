<template lang="pug">
  q-page
    q-list(bordered v-if="!loading" separator)
      q-item-label(header) 作成したWebhook一覧

      q-item(v-for="wh in webhooks" :key="wh.webhookId" clickable)
        q-item-section(avatar)
          q-avatar
            img(:src="getUserIconURL(wh.botUserId)")
        q-item-section
          q-item-label {{ wh.displayName }}
          q-item-label(caption lines="1") {{ wh.description }}

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
      this.$q.loading.show({
        delay: 400 // ms
      })
      try {
        const res = await getWebhooks()
        for (let wh of res.data) {
          this.$store.dispatch('fetchUserName', wh.botUserId)
        }
        this.webhooks = res.data
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
        this.$q.loading.hide()
      }
    },
    getUserIconURL (id) {
      return getUserIconURL(this.$store.state.usernames[id])
    }
  }
}
</script>
