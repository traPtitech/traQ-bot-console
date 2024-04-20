<template lang="pug">
  q-page.q-pa-md.q-gutter-sm
    q-banner.bg-grey-3(dense rounded)
      q-breadcrumbs(gutter="sm")
        q-breadcrumbs-el(v-for="i in breadcrumbItems" :label="i.name" :key="i.name", :to="i.to")

    div.markdown-body
      router-view
</template>

<script>
export default {
  name: 'Docs',
  computed: {
    breadcrumbItems () {
      return this.$route.path.split('/').filter(v => v !== '').map((v, i, arr) => {
        return {
          name: v,
          to: '/' + arr.slice(0, i + 1).join('/')
        }
      })
    }
  }
}
</script>

<style lang="stylus">
@import '../../node_modules/github-markdown-css/github-markdown.css'

.markdown-body
  box-sizing border-box
  min-width 200px
  max-width 980px
  margin 0 auto
  padding 45px
  @media (max-width: 767px)
    padding 15px
</style>
