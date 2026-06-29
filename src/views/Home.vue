<template>
  <q-page class="dashboard-page q-pa-md">
    <div class="dashboard-grid">
      <q-list
        class="dashboard-panel rounded-borders"
        bordered
        separator
      >
        <q-item class="dashboard-panel-header">
          <q-item-section>
            <q-item-label>Webhooks</q-item-label>
            <q-item-label caption>
              あなたが作成したWebhook
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn
              round
              dense
              flat
              icon="add"
              color="primary"
              to="/webhooks/create"
              aria-label="Webhookを作成"
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
        <q-item v-else-if="webhooks.length === 0">
          <q-item-section>
            <q-item-label class="text-grey-7">
              まだ Webhook はありません
            </q-item-label>
            <q-item-label caption>
              Webhookを作成するとここに表示されます
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          v-for="webhook in webhooks"
          v-else
          :key="webhook.id"
          :to="`/webhooks/${webhook.id}`"
          clickable
        >
          <q-item-section avatar>
            <q-avatar class="icon">
              <img :src="getUserIconURL(webhook.botUserName)">
              <q-icon
                class="type-icon"
                name="input"
                color="white"
              />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ webhook.displayName }}</q-item-label>
            <q-item-label
              caption
              lines="1"
            >
              {{ webhook.description }}
            </q-item-label>
          </q-item-section>
          <q-item-section
            side
            top
          >
            <q-badge
              v-if="webhook.secure"
              color="blue"
            >
              Secure
            </q-badge>
            <q-badge
              v-else
              color="red"
            >
              Insecure
            </q-badge>
          </q-item-section>
        </q-item>
      </q-list>
      <q-list
        class="dashboard-panel rounded-borders"
        bordered
        separator
      >
        <q-item class="dashboard-panel-header">
          <q-item-section>
            <q-item-label>BOTs</q-item-label>
            <q-item-label caption>
              あなたが登録したBOT
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn
              round
              dense
              flat
              icon="add"
              color="primary"
              to="/bots/create"
              aria-label="BOTを登録"
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
        <q-item v-else-if="bots.length === 0">
          <q-item-section>
            <q-item-label class="text-grey-7">
              まだ BOT はありません
            </q-item-label>
            <q-item-label caption>
              BOTを登録するとここに表示されます
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          v-for="bot in bots"
          v-else
          :key="bot.id"
          :to="`/bots/${bot.id}`"
          clickable
        >
          <q-item-section avatar>
            <q-avatar class="icon">
              <img :src="getUserIconURL(bot.botUserName)">
              <q-icon
                class="type-icon"
                name="tag_faces"
                color="white"
              />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>@{{ bot.botUserName }}</q-item-label>
            <q-item-label
              caption
              lines="1"
            >
              {{ bot.description }}
            </q-item-label>
          </q-item-section>
          <q-item-section
            side
            top
          >
            <q-badge
              v-if="bot.state === 0"
              color="grey"
            >
              停止
            </q-badge>
            <q-badge
              v-else-if="bot.state === 1"
              color="green"
            >
              有効
            </q-badge>
            <q-badge
              v-else-if="bot.state === 2"
              color="amber"
            >
              一時停止
            </q-badge>
            <q-badge v-else>
              不明な状態
            </q-badge>
          </q-item-section>
        </q-item>
      </q-list>
      <q-list
        class="dashboard-panel rounded-borders"
        bordered
        separator
      >
        <q-item class="dashboard-panel-header">
          <q-item-section>
            <q-item-label>Clients</q-item-label>
            <q-item-label caption>
              あなたが作成したClient
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn
              round
              dense
              flat
              icon="add"
              color="primary"
              to="/clients/create"
              aria-label="Clientを登録"
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
        <q-item v-else-if="clients.length === 0">
          <q-item-section>
            <q-item-label class="text-grey-7">
              まだ Client はありません
            </q-item-label>
            <q-item-label caption>
              Clientを登録するとここに表示されます
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          v-for="client in clients"
          v-else
          :key="client.id"
          :to="`/clients/${client.id}`"
          clickable
        >
          <q-item-section avatar>
            <q-avatar
              icon="chrome_reader_mode"
              color="primary"
              text-color="white"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ client.name }}</q-item-label>
            <q-item-label
              caption
              lines="1"
            >
              {{ client.description }}
            </q-item-label>
          </q-item-section>
          <q-item-section
            class="scope-section"
            side
            top
          >
            <q-badge
              v-for="scope in client.scopeLabels"
              :key="scope"
              class="scope"
            >
              {{ scope }}
            </q-badge>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import { traq, getUserIconURL } from '../api'
import clientScopes from '../clientScopes'

defineOptions({ name: 'PageHome' })

const $q = useQuasar()
const store = useStore()

const loading = ref(true)
const webhooks = ref<any[]>([])
const bots = ref<any[]>([])
const clients = ref<any[]>([])

const getWebhooks = async () => {
  const webhooks: any[] = (await traq.getWebhooks()).data

  const botUserNames = await Promise.all(
    webhooks.map(webhook => store.dispatch('fetchUserName', webhook.botUserId))
  )
  for (const i of webhooks.keys()) {
    webhooks[i].botUserName = botUserNames[i]
  }

  return webhooks
}

const getBots = async () => {
  const bots: any[] = (await traq.getBots()).data

  const botUserNames = await Promise.all(
    bots.map(bot => store.dispatch('fetchUserName', bot.botUserId))
  )
  for (const i of bots.keys()) {
    bots[i].botUserName = botUserNames[i]
  }

  return bots
}

const getClients = async () => {
  const clients: any[] = (await traq.getClients()).data
  for (const client of clients) {
    client.scopeLabels = client.scopes.map(
      (scope: string) => clientScopes.find(s => s.value === scope)?.label ?? scope
    )
  }
  return clients
}

onMounted(async () => {
  const [webhooksResult, botsResult, clientsResult] = await Promise.allSettled([
    getWebhooks(),
    getBots(),
    getClients()
  ])

  if (webhooksResult.status === 'fulfilled') {
    webhooks.value = webhooksResult.value
  } else {
    console.error(webhooksResult.reason)
  }

  if (botsResult.status === 'fulfilled') {
    bots.value = botsResult.value
  } else {
    console.error(botsResult.reason)
  }

  if (clientsResult.status === 'fulfilled') {
    clients.value = clientsResult.value
  } else {
    console.error(clientsResult.reason)
  }

  loading.value = false

  if ([webhooksResult, botsResult, clientsResult].some(result => result.status === 'rejected')) {
    $q.notify({
      icon: 'error_outline',
      color: 'red-5',
      textColor: 'white',
      message: 'ダッシュボードの取得時にエラーが発生しました'
    })
  }
})
</script>

<style scoped>
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
  gap: 16px;
  align-items: start;
}

.dashboard-panel {
  min-width: 0;
}

.dashboard-panel-header {
  min-height: 64px;
}

.icon {
  position: relative;
}

.type-icon {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50%;
  background-color: var(--q-color-primary);
  font-size: 0.8em;
  height: 1em;
  width: 1em;
  padding: 0.2em;
}

.scope-section {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: flex-end;
  max-width: 120px;
}
</style>
