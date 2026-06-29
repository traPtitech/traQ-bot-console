<template lang="pug">
  q-page.docs-page.q-pa-md.q-gutter-md
    q-banner.docs-breadcrumbs(dense rounded)
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

.docs-page
  min-height 100%
  background #f6f8fa

.docs-breadcrumbs
  max-width 980px
  margin 0 auto
  background #ffffff
  color #1f2328
  border 1px solid #d0d7de

.markdown-body
  box-sizing border-box
  min-width 200px
  max-width 980px
  margin 0 auto
  padding 40px 48px
  border 1px solid var(--color-border-default)
  border-radius 6px
  box-shadow 0 1px 2px rgba(31, 35, 40, 0.04)

  h1:first-child
    margin-top 0

  pre
    border 1px solid var(--color-border-default)

  table
    display table
    width 100%

  @media (max-width: 767px)
    padding 24px 18px

.body--dark
  .docs-page
    background #0d1117

  .docs-breadcrumbs
    background #161b22
    color #e6edf3
    border-color #30363d

    a
      color #79c0ff

  .markdown-body
    box-shadow none
    --color-accent-fg #79c0ff
</style>
