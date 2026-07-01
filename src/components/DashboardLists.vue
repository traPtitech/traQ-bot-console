<template>
  <div class="dashboard-grid">
    <DashboardPanel
      title="Webhooks"
      caption="あなたが作成したWebhook"
      :add-to="{ name: 'createWebhook' }"
      add-label="Webhookを作成"
      :loading="loading"
      :empty="webhooks.length === 0"
      empty-title="まだ Webhook はありません"
      empty-caption="Webhookを作成するとここに表示されます"
    >
      <q-item
        v-for="webhook in webhooks"
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
        </q-item-section>
      </q-item>
    </DashboardPanel>

    <DashboardPanel
      title="BOTs"
      caption="あなたが登録したBOT"
      :add-to="{ name: 'createBot' }"
      add-label="BOTを登録"
      :loading="loading"
      :empty="bots.length === 0"
      empty-title="まだ BOT はありません"
      empty-caption="BOTを登録するとここに表示されます"
    >
      <q-item
        v-for="bot in bots"
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
        </q-item-section>
      </q-item>
    </DashboardPanel>

    <DashboardPanel
      title="Clients"
      caption="あなたが作成したClient"
      :add-to="{ name: 'createClient' }"
      add-label="Clientを登録"
      :loading="loading"
      :empty="clients.length === 0"
      empty-title="まだ Client はありません"
      empty-caption="Clientを登録するとここに表示されます"
    >
      <q-item
        v-for="client in clients"
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
    </DashboardPanel>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Bot, OAuth2Client, Webhook } from "@traptitech/traq";
import { useQuasar } from "quasar";
import { useStore } from "../store";
import { traq, getUserIconURL } from "../api";
import clientScopes from "../clientScopes";
import DashboardPanel from "./DashboardPanel.vue";

defineOptions({ name: "DashboardLists" });

const $q = useQuasar();
const store = useStore();

const loading = ref(true);

type WebhookListItem = Webhook & {
  botUserName: string;
};

type BotListItem = Bot & {
  botUserName: string;
};

type ClientListItem = OAuth2Client & {
  scopeLabels: string[];
};

const webhooks = ref<WebhookListItem[]>([]);
const bots = ref<BotListItem[]>([]);
const clients = ref<ClientListItem[]>([]);

const getWebhooks = async () => {
  const webhooks = (await traq.getWebhooks(false)).data;

  return Promise.all(
    webhooks.map(async (webhook) => ({
      ...webhook,
      botUserName: await store.fetchUserName(webhook.botUserId),
    })),
  );
};

const getBots = async () => {
  const bots = (await traq.getBots(false)).data;

  return Promise.all(
    bots.map(async (bot) => ({
      ...bot,
      botUserName: await store.fetchUserName(bot.botUserId),
    })),
  );
};

const getClients = async () => {
  const clients = (await traq.getClients(false)).data;

  return clients.map((client) => ({
    ...client,
    scopeLabels: client.scopes.map(
      (scope) => clientScopes.find((s) => s.value === scope)?.label ?? scope,
    ),
  }));
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
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
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
</style>
