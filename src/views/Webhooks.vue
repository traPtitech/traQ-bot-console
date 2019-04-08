<template lang="pug">
  q-page.q-pa-md.q-gutter-md
    template(v-if="!loading")
      q-list(bordered separator)
        q-item-label(header) あなたが作成したWebhook一覧

        q-item(v-for="wh in myWebhooks" :key="wh.webhookId" clickable :to="`/webhooks/${wh.webhookId}`")
          q-item-section(avatar)
            q-avatar
              img(:src="getUserIconURL(wh.botUserName)")
          q-item-section
            q-item-label {{ wh.displayName }}
            q-item-label(caption lines="1") {{ wh.description }}

      q-list(bordered separator v-if="othersWebhooks.length > 0")
        q-item-label(header) 他の人が作成したWebhook一覧 (管理者権限による表示)

        q-item(v-for="wh in othersWebhooks" :key="wh.webhookId" clickable :to="`/webhooks/${wh.webhookId}`")
          q-item-section(avatar)
            q-avatar
              img(:src="getUserIconURL(wh.botUserName)")
          q-item-section
            q-item-label {{ wh.displayName }}
            q-item-label(caption lines="1") {{ wh.description }}
          q-item-section(side top)
            q-item-label(caption) @{{ wh.creatorName }}によって作成

    div.q-pa-md
      q-btn.full-width(color="primary" unelevated to="/webhooks/create") 新規作成

</template>

<script>
import { mapState } from 'vuex'
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
  computed: {
    myWebhooks () {
      return this.webhooks.filter(w => w.creatorId === this.userInfo.userId)
    },
    othersWebhooks () {
      return this.webhooks.filter(w => w.creatorId !== this.userInfo.userId)
    },
    ...mapState([
      'userInfo'
    ])
  },
  methods: {
    async getWebhooks () {
      this.loading = true
      this.$q.loading.show({ delay: 400 })
      try {
        const res = await getWebhooks()
        for (let wh of res.data) {
          wh.botUserName = await this.$store.dispatch('fetchUserName', wh.botUserId)
          wh.creatorName = await this.$store.dispatch('fetchUserName', wh.creatorId)
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
