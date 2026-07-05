<template>
  <div class="dashboard">
    <q-input
      v-model="searchQuery"
      class="dashboard-search"
      dense
      outlined
      clearable
      placeholder="Webhook / BOT / Client を検索"
    >
      <template #prepend>
        <q-icon name="search" />
      </template>
    </q-input>
    <div class="dashboard-grid">
      <DashboardPanel
        v-if="showWebhooks"
        title="Webhooks"
        :caption="webhooksCaption"
        :add-to="{ name: 'createWebhook' }"
        add-label="Webhookを作成"
        :loading="loading"
        :empty="webhooks.length === 0"
        :empty-title="webhooksEmptyTitle"
        :empty-caption="webhooksEmptyCaption"
        :filtered-empty="isSearching && filteredWebhooks.length === 0"
        filtered-empty-title="検索結果はありません"
        filtered-empty-caption="検索条件を変更してください"
      >
        <q-item
          v-for="webhook in filteredWebhooks"
          :key="webhook.id"
          :to="{ name: 'webhookDetail', params: { id: webhook.id } }"
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
            <q-item-label
              v-if="includeAll && webhook.ownerName !== undefined"
              caption
            >
              @{{ webhook.ownerName }}によって作成
            </q-item-label>
          </q-item-section>
        </q-item>
      </DashboardPanel>

      <DashboardPanel
        v-if="showBots"
        title="BOTs"
        :caption="botsCaption"
        :add-to="{ name: 'createBot' }"
        add-label="BOTを登録"
        :loading="loading"
        :empty="bots.length === 0"
        :empty-title="botsEmptyTitle"
        :empty-caption="botsEmptyCaption"
        :filtered-empty="isSearching && filteredBots.length === 0"
        filtered-empty-title="検索結果はありません"
        filtered-empty-caption="検索条件を変更してください"
      >
        <q-item
          v-for="bot in filteredBots"
          :key="bot.id"
          :to="{ name: 'botDetail', params: { id: bot.id } }"
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
            <q-item-label
              v-if="includeAll && bot.developerName !== undefined"
              caption
            >
              @{{ bot.developerName }}によって登録
            </q-item-label>
          </q-item-section>
        </q-item>
      </DashboardPanel>

      <DashboardPanel
        v-if="showClients"
        title="Clients"
        :caption="clientsCaption"
        :add-to="{ name: 'createClient' }"
        add-label="Clientを登録"
        :loading="loading"
        :empty="clients.length === 0"
        :empty-title="clientsEmptyTitle"
        :empty-caption="clientsEmptyCaption"
        :filtered-empty="isSearching && filteredClients.length === 0"
        filtered-empty-title="検索結果はありません"
        filtered-empty-caption="検索条件を変更してください"
      >
        <q-item
          v-for="client in filteredClients"
          :key="client.id"
          :to="{ name: 'clientDetail', params: { id: client.id } }"
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
            :class="includeAll ? 'meta-section' : 'scope-section'"
            side
            top
          >
            <q-item-label
              v-if="includeAll && client.developerName !== undefined"
              caption
            >
              @{{ client.developerName }}によって作成
            </q-item-label>
            <q-badge
              v-for="scope in client.scopeLabels"
              :key="scope"
              class="scope"
            >
              {{ scope }}
            </q-badge>
          </q-item-section>
        </q-item>
      </DashboardPanel>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "../store";
import { traq, getUserIconURL } from "../api";
import clientScopes from "../clientScopes";
import {
  filterDashboardItems,
  getBotSearchFields,
  getClientSearchFields,
  getWebhookSearchFields,
  normalizeDashboardSearchQuery,
} from "./dashboard-search";
import type {
  DashboardBot,
  DashboardClient,
  DashboardWebhook,
} from "./dashboard-search";
import DashboardPanel from "./DashboardPanel.vue";

defineOptions({ name: "DashboardLists" });

const {
  includeAll = false,
  showWebhooks = true,
  showBots = true,
  showClients = true,
} = defineProps<{
  includeAll?: boolean;
  showWebhooks?: boolean;
  showBots?: boolean;
  showClients?: boolean;
}>();

const $q = useQuasar();
const store = useStore();

const loading = ref(true);
const searchQuery = ref("");

const webhooks = ref<DashboardWebhook[]>([]);
const bots = ref<DashboardBot[]>([]);
const clients = ref<DashboardClient[]>([]);
const normalizedSearchQuery = computed(() => normalizeDashboardSearchQuery(searchQuery.value));
const isSearching = computed(() => normalizedSearchQuery.value !== "");

const webhooksCaption = computed(() =>
  includeAll ? "管理者権限で表示できるWebhook" : "あなたが作成したWebhook",
);
const botsCaption = computed(() =>
  includeAll ? "管理者権限で表示できるBOT" : "あなたが登録したBOT",
);
const clientsCaption = computed(() =>
  includeAll ? "管理者権限で表示できるClient" : "あなたが作成したClient",
);

const webhooksEmptyTitle = computed(() =>
  includeAll ? "表示できる Webhook はありません" : "まだ Webhook はありません",
);
const botsEmptyTitle = computed(() =>
  includeAll ? "表示できる BOT はありません" : "まだ BOT はありません",
);
const clientsEmptyTitle = computed(() =>
  includeAll ? "表示できる Client はありません" : "まだ Client はありません",
);

const webhooksEmptyCaption = computed(() =>
  includeAll
    ? "Webhookが存在しないか、表示権限がありません"
    : "Webhookを作成するとここに表示されます",
);
const botsEmptyCaption = computed(() =>
  includeAll ? "BOTが存在しないか、表示権限がありません" : "BOTを登録するとここに表示されます",
);
const clientsEmptyCaption = computed(() =>
  includeAll
    ? "Clientが存在しないか、表示権限がありません"
    : "Clientを登録するとここに表示されます",
);

const filteredWebhooks = computed(() =>
  filterDashboardItems(webhooks.value, normalizedSearchQuery.value, getWebhookSearchFields),
);
const filteredBots = computed(() =>
  filterDashboardItems(bots.value, normalizedSearchQuery.value, getBotSearchFields),
);
const filteredClients = computed(() =>
  filterDashboardItems(clients.value, normalizedSearchQuery.value, getClientSearchFields),
);

const getWebhooks = async () => {
  if (!showWebhooks) return [];

  const webhooks = (await traq.getWebhooks(includeAll)).data;

  return Promise.all(
    webhooks.map(async (webhook) => ({
      ...webhook,
      botUserName: await store.fetchUserName(webhook.botUserId),
      ownerName: includeAll ? await store.fetchUserName(webhook.ownerId) : undefined,
    })),
  );
};

const getBots = async () => {
  if (!showBots) return [];

  const bots = (await traq.getBots(includeAll)).data;

  return Promise.all(
    bots.map(async (bot) => ({
      ...bot,
      botUserName: await store.fetchUserName(bot.botUserId),
      developerName: includeAll ? await store.fetchUserName(bot.developerId) : undefined,
    })),
  );
};

const getClients = async () => {
  if (!showClients) return [];

  const clients = (await traq.getClients(includeAll)).data;

  return Promise.all(
    clients.map(async (client) => ({
      ...client,
      developerName: includeAll ? await store.fetchUserName(client.developerId) : undefined,
      scopeLabels: client.scopes.map(
        (scope) => clientScopes.find((s) => s.value === scope)?.label ?? scope,
      ),
    })),
  );
};

onMounted(async () => {
  const [webhooksResult, botsResult, clientsResult] = await Promise.allSettled([
    getWebhooks(),
    getBots(),
    getClients(),
  ]);

  if (webhooksResult.status === "fulfilled") {
    webhooks.value = webhooksResult.value;
  } else {
    console.error(webhooksResult.reason);
  }

  if (botsResult.status === "fulfilled") {
    bots.value = botsResult.value;
  } else {
    console.error(botsResult.reason);
  }

  if (clientsResult.status === "fulfilled") {
    clients.value = clientsResult.value;
  } else {
    console.error(clientsResult.reason);
  }

  loading.value = false;

  if (
    [webhooksResult, botsResult, clientsResult].some(
      (result) => result.status === "rejected",
    )
  ) {
    $q.notify({
      icon: "error_outline",
      color: "red-5",
      textColor: "white",
      message: "ダッシュボードの取得時にエラーが発生しました",
    });
  }
});
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dashboard-search {
  max-width: 480px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 480px), 1fr));
  gap: 16px;
  align-items: start;
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

.meta-section {
  align-items: flex-end;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: flex-end;
  max-width: 180px;
}
</style>
