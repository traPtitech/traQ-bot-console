<template>
  <q-list
    class="dashboard-panel rounded-borders"
    bordered
    separator
  >
    <q-item class="dashboard-panel-header">
      <q-item-section>
        <q-item-label>{{ title }}</q-item-label>
        <q-item-label caption>
          {{ caption }}
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-btn
          round
          dense
          flat
          icon="add"
          color="primary"
          :to="addTo"
          :aria-label="addLabel"
        />
      </q-item-section>
    </q-item>
    <q-item v-if="loading">
      <q-item-section avatar>
        <q-skeleton type="QAvatar" />
      </q-item-section>
      <q-item-section>
        <q-item-label>
          <q-skeleton type="text" />
        </q-item-label>
        <q-item-label caption>
          <q-skeleton type="text" />
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item v-else-if="empty">
      <q-item-section>
        <q-item-label class="text-grey-7">
          {{ emptyTitle }}
        </q-item-label>
        <q-item-label caption>
          {{ emptyCaption }}
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item v-else-if="filteredEmpty">
      <q-item-section>
        <q-item-label class="text-grey-7">
          {{ filteredEmptyTitle }}
        </q-item-label>
        <q-item-label caption>
          {{ filteredEmptyCaption }}
        </q-item-label>
      </q-item-section>
    </q-item>
    <template v-else>
      <slot />
    </template>
  </q-list>
</template>

<script setup lang="ts">
import type { RouterLinkProps } from 'vue-router'

defineOptions({ name: 'DashboardPanel' })

defineProps<{
  title: string
  caption: string
  addTo: RouterLinkProps['to']
  addLabel: string
  loading: boolean
  empty: boolean
  emptyTitle: string
  emptyCaption: string
  filteredEmpty: boolean
  filteredEmptyTitle: string
  filteredEmptyCaption: string
}>()
</script>

<style scoped>
.dashboard-panel {
  min-width: 0;
}

.dashboard-panel-header {
  min-height: 64px;
}
</style>
