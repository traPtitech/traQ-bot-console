<template lang="pug">
  q-layout(view="hHh LpR fFf")
    q-header.bg-primary.text-white
      q-toolbar
        q-btn(flat @click="left = !left" round dense icon="menu")
        q-toolbar-title traQ BOT Console

    q-scroll-area.fit
      q-drawer(v-model="left" persistent show-if-above)
        q-list
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
          q-separator
          q-item(clickable to="/account")
            q-item-section(avatar)
              q-icon(name="person")
            q-item-section アカウント情報

    q-page-container
      router-view
</template>

<script>
export default {
  name: 'LayoutDefault',
  data () {
    return {
      left: true
    }
  }
}
</script>
