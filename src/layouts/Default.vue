<template>
  <q-layout view="hHh LpR fFf">
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          flat
          round
          dense
          icon="menu"
          @click="left = !left"
        />
        <q-toolbar-title>traQ BOT Console</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="left"
      persistent
      show-if-above
      :width="240"
    >
      <q-scroll-area
        class="fit"
        style="border-right: 1px solid #ddd"
      >
        <q-img
          v-if="userInfo !== null"
          src="/material.png"
          style="height: 150px"
        >
          <div class="absolute-bottom bg-transparent">
            <q-avatar
              class="q-mb-sm"
              size="56px"
            >
              <img :src="getUserIconURL(userInfo.name)">
            </q-avatar>
            <div class="text-weight-bold">
              {{ userInfo.displayName }}
            </div>
            <div>@{{ userInfo.name }}</div>
          </div>
        </q-img>
        <q-list padding>
          <q-item
            clickable
            to="/"
            exact
          >
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>ダッシュボード</q-item-section>
          </q-item>
          <q-item
            v-if="hasAdminDashboard"
            clickable
            :to="{ name: 'adminDashboard' }"
          >
            <q-item-section avatar>
              <q-icon name="admin_panel_settings" />
            </q-item-section>
            <q-item-section>管理者ダッシュボード</q-item-section>
          </q-item>
          <q-item
            clickable
            to="/docs"
          >
            <q-item-section avatar>
              <q-icon name="help" />
            </q-item-section>
            <q-item-section>マニュアル</q-item-section>
          </q-item>
          <q-separator />
          <q-item
            clickable
            @click="logout"
          >
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>
            <q-item-section>ログアウト</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from '../store'
import { traq, getUserIconURL } from '../api'
import {
  canAccessOthersBots,
  canAccessOthersWebhooks,
  canManageOthersClients,
} from '../permissions'

defineOptions({ name: 'LayoutDefault' })

const store = useStore()
const left = ref(true)
const userInfo = computed(() => store.userInfo)
const hasAdminDashboard = computed(
  () =>
    canAccessOthersWebhooks(userInfo.value) ||
    canAccessOthersBots(userInfo.value) ||
    canManageOthersClients(userInfo.value),
)

const logout = async () => {
  try {
    if (store.authToken !== null) {
      await traq.revokeOAuth2Token(store.authToken)
    }
  } catch (e: any) {
  }
  store.setToken(null)
  store.putChannelList([])
  location.reload()
}
</script>
