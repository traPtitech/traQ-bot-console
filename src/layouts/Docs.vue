<template>
  <q-page class="docs-page q-pa-md q-gutter-md">
    <q-banner
      class="docs-breadcrumbs"
      dense
      rounded
    >
      <q-breadcrumbs gutter="sm">
        <q-breadcrumbs-el
          v-for="i in breadcrumbItems"
          :key="i.name"
          :label="i.name"
          :to="i.to"
        />
      </q-breadcrumbs>
    </q-banner>
    <div class="markdown-body">
      <router-view />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({ name: 'Docs' })

const route = useRoute()
const breadcrumbItems = computed(() => route.path.split('/').filter(v => v !== '').map((v, i, arr) => {
  return {
    name: v,
    to: '/' + arr.slice(0, i + 1).join('/')
  }
}))
</script>

<style>
@import '../../node_modules/github-markdown-css/github-markdown.css';

.docs-page {
  min-height: 100%;
}

.docs-breadcrumbs {
  max-width: 980px;
  margin: 0 auto;
  border: 1px solid #d0d7de;
}

.markdown-body {
  box-sizing: border-box;
  background-color: transparent;
  min-width: 200px;
  max-width: 980px;
  margin: 0 auto;
  padding: 40px 48px;
  border: 1px solid var(--color-border-default);
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(31, 35, 40, 0.04);
}

.markdown-body h1:first-child {
  margin-top: 0;
}

.markdown-body pre {
  border: 1px solid var(--color-border-default);
}

.markdown-body table {
  display: table;
  width: 100%;
}

@media (max-width: 767px) {
  .markdown-body {
    padding: 24px 18px;
  }
}

.body--dark .docs-breadcrumbs {
  border-color: #30363d;
}

.body--dark .docs-breadcrumbs a {
  color: #79c0ff;
}

.body--dark .markdown-body {
  box-shadow: none;
  --color-accent-fg: #79c0ff;
}
</style>
