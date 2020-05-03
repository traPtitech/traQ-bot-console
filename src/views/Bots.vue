<template lang="pug">
  q-page.q-pa-md.q-gutter-md
    q-list.rounded-borders(bordered separator)
      q-item-label(header) あなたが登録したBOT

      q-item(v-if="loading")
        q-item-section(avatar)
          q-skeleton(type="QAvatar")
        q-item-section
          q-item-label
            q-skeleton(type="text")
          q-item-label(caption lines="1")
            q-skeleton(type="text")

      q-item(v-else v-for="b in myBots" :key="b.id" :to="`/bots/${b.id}`" clickable)
        q-item-section(avatar)
          q-avatar
            img(:src="getUserIconURL(b.botUserName)")
        q-item-section
          q-item-label @{{ b.botUserName }}
          q-item-label(caption lines="1") {{ b.description }}

    q-list.rounded-borders(v-if="!loading && othersBots.length > 0" bordered separator)
      q-item-label(header) 他の人が登録したBOT (管理者権限による表示)

      q-item(v-for="b in othersBots" :key="b.id" :to="`/bots/${b.id}`" clickable)
        q-item-section(avatar)
          q-avatar
            img(:src="getUserIconURL(b.botUserName)")
        q-item-section
          q-item-label @{{ b.botUserName }}
          q-item-label(caption lines="1") {{ b.description }}
        q-item-section(side top)
          q-item-label(caption) @{{ b.developerName }}によって登録

    div.q-pa-md
      q-btn.full-width(color="primary" unelevated to="/bots/create") 新規登録
</template>

<script>
import { mapState } from 'vuex'
import { traq, getUserIconURL } from '../api'

export default {
  name: 'Bots',
  data () {
    return {
      loading: false,
      bots: []
    }
  },
  async mounted () {
    await this.getBots()
  },
  computed: {
    myBots () {
      return this.bots.filter(b => b.developerId === this.userInfo.id)
    },
    othersBots () {
      return this.bots.filter(b => b.developerId !== this.userInfo.id)
    },
    ...mapState([
      'userInfo'
    ])
  },
  methods: {
    getUserIconURL,
    async getBots () {
      this.loading = true
      try {
        const res = await traq.getBots(this.userInfo.permissions.includes('access_others_bot'))
        for (const bot of res.data) {
          bot.botUserName = await this.$store.dispatch('fetchUserName', bot.botUserId)
          bot.developerName = await this.$store.dispatch('fetchUserName', bot.developerId)
        }
        this.bots = res.data
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
    }
  }
}
</script>
