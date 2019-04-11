<template lang="pug">
  q-page.q-pa-md.q-gutter-md
    template(v-if="!loading")
      q-list.rounded-borders(bordered separator)
        q-item-label(header) あなたが作成したBOT

        q-item(v-for="b in myBots" :key="b.botId" :to="`/bots/${b.botId}`" clickable)
          q-item-section(avatar)
            q-avatar
              img(:src="getUserIconURL(b.botUserName)")
          q-item-section
            q-item-label @{{ b.botUserName }}
            q-item-label(caption lines="1") {{ b.description }}

      q-list.rounded-borders(v-if="othersBots.length > 0" bordered separator)
        q-item-label(header) 他の人が作成したBOT (管理者権限による表示)

        q-item(v-for="b in othersBots" :key="b.botId" :to="`/bots/${b.botId}`" clickable)
          q-item-section(avatar)
            q-avatar
              img(:src="getUserIconURL(b.botUserName)")
          q-item-section
            q-item-label @{{ b.botUserName }}
            q-item-label(caption lines="1") {{ b.description }}
          q-item-section(side top)
            q-item-label(caption) @{{ b.creatorName }}によって作成

    div.q-pa-md
      q-btn.full-width(color="primary" unelevated to="/bots/create") 新規作成
</template>

<script>
import { mapState } from 'vuex'
import { getBots, getUserIconURL } from '../api'

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
      return this.bots.filter(w => w.creatorId === this.userInfo.userId)
    },
    othersBots () {
      return this.bots.filter(w => w.creatorId !== this.userInfo.userId)
    },
    ...mapState([
      'userInfo'
    ])
  },
  methods: {
    getUserIconURL,
    async getBots () {
      this.loading = true
      this.$q.loading.show({ delay: 400 })
      try {
        const res = await getBots()
        for (let bot of res.data) {
          bot.botUserName = await this.$store.dispatch('fetchUserName', bot.botUserId)
          bot.creatorName = await this.$store.dispatch('fetchUserName', bot.creatorId)
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
        this.$q.loading.hide()
      }
    }
  }
}
</script>
