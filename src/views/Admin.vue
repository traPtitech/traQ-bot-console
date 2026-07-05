<template>
  <q-page class="dashboard-page q-pa-md">
    <DashboardLists
      v-if="hasAdminDashboard"
      include-all
      :show-webhooks="showWebhooks"
      :show-bots="showBots"
      :show-clients="showClients"
    />
    <q-banner v-else>
      管理者権限で表示できる項目はありません
    </q-banner>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DashboardLists from '../components/DashboardLists.vue'
import {
  canAccessOthersBots,
  canAccessOthersWebhooks,
  canManageOthersClients,
} from '../permissions'
import { useStore } from '../store'

defineOptions({ name: 'PageAdmin' })

const store = useStore()

const showWebhooks = computed(() => canAccessOthersWebhooks(store.userInfo))
const showBots = computed(() => canAccessOthersBots(store.userInfo))
const showClients = computed(() => canManageOthersClients(store.userInfo))
const hasAdminDashboard = computed(
  () => showWebhooks.value || showBots.value || showClients.value,
)
</script>
