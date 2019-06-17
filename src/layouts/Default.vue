<template lang="pug">
  q-layout(view="hHh LpR fFf")
    q-header.bg-primary.text-white
      q-toolbar
        q-btn(flat @click="left = !left" round dense icon="menu")
        q-toolbar-title traQ BOT Console

    q-drawer(v-model="left" persistent show-if-above)
      q-scroll-area.fit(style="border-right: 1px solid #ddd")
        q-img(v-if="userInfo !== null" src="https://cdn.quasar-framework.org/img/material.png" style="height: 150px")
          div.absolute-bottom.bg-transparent
            q-avatar.q-mb-sm(size="56px")
              img(:src="getUserIconURL(userInfo.name)")
            div.text-weight-bold {{ userInfo.displayName }}
            div @{{ userInfo.name }}
        q-list(padding)
          q-item(clickable to="/" exact)
            q-item-section(avatar)
              q-icon(name="home")
            q-item-section ダッシュボード
          q-item(clickable to="/webhooks")
            q-item-section(avatar)
              q-icon(name="input")
            q-item-section Webhooks
          q-item(clickable to="/bots")
            q-item-section(avatar)
              q-icon(name="tag_faces")
            q-item-section BOTs
          q-item(clickable to="/clients")
            q-item-section(avatar)
              q-icon(name="chrome_reader_mode")
            q-item-section Clients
          q-item(clickable to="/docs")
            q-item-section(avatar)
              q-icon(name="help")
            q-item-section マニュアル
          q-separator
          q-item(clickable @click="logout")
            q-item-section(avatar)
              q-icon(name="logout")
            q-item-section ログアウト

    q-page-container
      router-view
</template>

<script>
import { mapState } from 'vuex'
import { getUserIconURL, revokeAuthToken } from '../api'

export default {
  name: 'LayoutDefault',
  data () {
    return {
      left: true
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  methods: {
    getUserIconURL,
    async logout () {
      try {
        await revokeAuthToken(this.$store.state.authToken)
      } catch (e) {
      }
      this.$store.commit('setToken', null)
      this.$store.commit('putChannelList', [])
      location.reload()
    }
  }
}
</script>
