<template>
  <q-page class="dashboard-page q-pa-md">
    <DashboardLists />
  </q-page>
</template>

<script setup lang="ts">
import DashboardLists from '../components/DashboardLists.vue'

defineOptions({ name: 'PageHome' })
</script>
