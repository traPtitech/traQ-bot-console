<template lang="pug">
  q-page.q-pa-md.q-gutter-md
    q-list.rounded-borders(bordered separator)
      q-item-label(header) あなたが作成したWebhook

      q-item(v-if="loading")
        q-item-section(avatar)
          q-skeleton(type="QAvatar")
        q-item-section
          q-item-label
            q-skeleton(type="text")
          q-item-label(caption lines="1")
            q-skeleton(type="text")

      q-item(v-else v-for="wh in myWebhooks" :key="wh.id" clickable :to="`/webhooks/${wh.id}`")
        q-item-section(avatar)
          q-avatar
            img(:src="getUserIconURL(wh.botUserName)")
        q-item-section
          q-item-label {{ wh.displayName }}
          q-item-label(caption lines="1") {{ wh.description }}

    q-list.rounded-borders(bordered separator v-if="!loading && othersWebhooks.length > 0")
      q-item-label(header) 他の人が作成したWebhook (管理者権限による表示)

      q-item(v-for="wh in othersWebhooks" :key="wh.id" clickable :to="`/webhooks/${wh.id}`")
        q-item-section(avatar)
          q-avatar
            img(:src="getUserIconURL(wh.botUserName)")
        q-item-section
          q-item-label {{ wh.displayName }}
          q-item-label(caption lines="1") {{ wh.description }}
        q-item-section(side top)
          q-item-label(caption) @{{ wh.ownerName }}によって作成

    div.q-pa-md
      q-btn.full-width(color="primary" unelevated to="/webhooks/create") 新規作成

</template>

<script>
import { mapState } from 'vuex'
import { traq, getUserIconURL } from '../api'

export default {
  name: 'Webhooks',
  data () {
    return {
      loading: false,
      webhooks: []
    }
  },
  computed: {
    myWebhooks () {
      return this.webhooks.filter(w => w.ownerId === this.userInfo.id)
    },
    othersWebhooks () {
      return this.webhooks.filter(w => w.ownerId !== this.userInfo.id)
    },
    ...mapState([
      'userInfo'
    ])
  },
  async mounted () {
    await this.getWebhooks()
  },
  methods: {
    async getWebhooks () {
      this.loading = true
      try {
        const res = await traq.getWebhooks(this.userInfo.permissions.includes('access_others_webhook'))
        for (const wh of res.data) {
          wh.botUserName = await this.$store.dispatch('fetchUserName', wh.botUserId)
          wh.ownerName = await this.$store.dispatch('fetchUserName', wh.ownerId)
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
      }
    },
    getUserIconURL
  }
}
</script>
