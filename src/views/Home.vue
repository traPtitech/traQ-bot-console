<template lang="pug">
  q-page.dashboard-page.q-pa-md
    div.dashboard-grid
      q-list.dashboard-panel.rounded-borders(bordered separator)
        q-item.dashboard-panel-header
          q-item-section
            q-item-label Webhooks
            q-item-label(caption) あなたが作成したWebhook
          q-item-section(side)
            q-btn(round dense flat icon="add" color="primary" to="/webhooks/create" aria-label="Webhookを作成")

        q-item(v-if="loading")
          q-item-section(avatar)
            q-skeleton(type="QAvatar")
          q-item-section
            q-item-label
              q-skeleton(type="text")
            q-item-label(caption)
              q-skeleton(type="text")

        q-item(v-else-if="webhooks.length === 0")
          q-item-section
            q-item-label.text-grey-7 まだ Webhook はありません
            q-item-label(caption) Webhookを作成するとここに表示されます

        q-item(v-else v-for="webhook in webhooks" :key="webhook.id" :to="`/webhooks/${webhook.id}`" clickable)
          q-item-section(avatar)
            q-avatar.icon
              img(:src="getUserIconURL(webhook.botUserName)")
              q-icon.type-icon(name="input" color="white")
          q-item-section
            q-item-label {{ webhook.displayName }}
            q-item-label(caption lines="1") {{ webhook.description }}
          q-item-section(side top)
            q-badge(v-if="webhook.secure" color="blue") Secure
            q-badge(v-else color="red") Insecure

      q-list.dashboard-panel.rounded-borders(bordered separator)
        q-item.dashboard-panel-header
          q-item-section
            q-item-label BOTs
            q-item-label(caption) あなたが登録したBOT
          q-item-section(side)
            q-btn(round dense flat icon="add" color="primary" to="/bots/create" aria-label="BOTを登録")

        q-item(v-if="loading")
          q-item-section(avatar)
            q-skeleton(type="QAvatar")
          q-item-section
            q-item-label
              q-skeleton(type="text")
            q-item-label(caption)
              q-skeleton(type="text")

        q-item(v-else-if="bots.length === 0")
          q-item-section
            q-item-label.text-grey-7 まだ BOT はありません
            q-item-label(caption) BOTを登録するとここに表示されます

        q-item(v-else v-for="bot in bots" :key="bot.id" :to="`/bots/${bot.id}`" clickable)
          q-item-section(avatar)
            q-avatar.icon
              img(:src="getUserIconURL(bot.botUserName)")
              q-icon.type-icon(name="tag_faces" color="white")
          q-item-section
            q-item-label @{{ bot.botUserName }}
            q-item-label(caption lines="1") {{ bot.description }}
          q-item-section(side top)
            q-badge(v-if="bot.state === 0" color="grey") 停止
            q-badge(v-else-if="bot.state === 1" color="green") 有効
            q-badge(v-else-if="bot.state === 2" color="amber") 一時停止
            q-badge(v-else) 不明な状態

      q-list.dashboard-panel.rounded-borders(bordered separator)
        q-item.dashboard-panel-header
          q-item-section
            q-item-label Clients
            q-item-label(caption) あなたが作成したClient
          q-item-section(side)
            q-btn(round dense flat icon="add" color="primary" to="/clients/create" aria-label="Clientを登録")

        q-item(v-if="loading")
          q-item-section(avatar)
            q-skeleton(type="QAvatar")
          q-item-section
            q-item-label
              q-skeleton(type="text")
            q-item-label(caption)
              q-skeleton(type="text")

        q-item(v-else-if="clients.length === 0")
          q-item-section
            q-item-label.text-grey-7 まだ Client はありません
            q-item-label(caption) Clientを登録するとここに表示されます

        q-item(v-else v-for="client in clients" :key="client.id" :to="`/clients/${client.id}`" clickable)
          q-item-section(avatar)
            q-avatar(icon="chrome_reader_mode" color="primary" text-color="white")
          q-item-section
            q-item-label {{ client.name }}
            q-item-label(caption lines="1") {{ client.description }}
          q-item-section.scope-section(side top)
            q-badge.scope(v-for="scope in client.scopeLabels" :key="scope") {{ scope }}
</template>

<script>
import { traq, getUserIconURL } from '../api'
import clientScopes from '../clientScopes'

export default {
  name: 'PageHome',
  data () {
    return {
      loading: true,
      webhooks: [],
      bots: [],
      clients: []
    }
  },
  async mounted () {
    const [webhooks, bots, clients] = await Promise.allSettled([
      this.getWebhooks(),
      this.getBots(),
      this.getClients()
    ])

    if (webhooks.status === 'fulfilled') {
      this.webhooks = webhooks.value
    } else {
      console.error(webhooks.reason)
    }

    if (bots.status === 'fulfilled') {
      this.bots = bots.value
    } else {
      console.error(bots.reason)
    }

    if (clients.status === 'fulfilled') {
      this.clients = clients.value
    } else {
      console.error(clients.reason)
    }

    this.loading = false

    if ([webhooks, bots, clients].some(result => result.status === 'rejected')) {
      this.$q.notify({
        icon: 'error_outline',
        color: 'red-5',
        textColor: 'white',
        message: 'ダッシュボードの取得時にエラーが発生しました'
      })
    }
  },
  methods: {
    getUserIconURL,
    async getWebhooks () {
      const webhooks = (await traq.getWebhooks()).data

      const botUserNames = await Promise.all(
        webhooks.map(webhook => this.$store.dispatch('fetchUserName', webhook.botUserId))
      )
      for (const i of webhooks.keys()) {
        webhooks[i].botUserName = botUserNames[i]
      }

      return webhooks
    },
    async getBots () {
      const bots = (await traq.getBots()).data

      const botUserNames = await Promise.all(
        bots.map(bot => this.$store.dispatch('fetchUserName', bot.botUserId))
      )
      for (const i of bots.keys()) {
        bots[i].botUserName = botUserNames[i]
      }

      return bots
    },
    async getClients () {
      const clients = (await traq.getClients()).data
      for (const client of clients) {
        client.scopeLabels = client.scopes.map(
          scope => clientScopes.find(s => s.value === scope)?.label ?? scope
        )
      }
      return clients
    }
  }
}
</script>

<style lang="stylus" scoped>
.dashboard-grid {
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(480px, 1fr))
  gap: 16px
  align-items: start
}

.dashboard-panel {
  min-width: 0
}

.dashboard-panel-header {
  min-height: 64px
}

.icon {
  position: relative
}

.type-icon {
  position: absolute
  top: 0
  left: 0
  border-radius: 50%
  background-color: var(--q-color-primary)
  font-size: 0.8em
  height: 1em
  width: 1em
  padding: 0.2em
}

.scope-section {
  display: flex
  flex-wrap: wrap
  gap: 4px
  justify-content: flex-end
  max-width: 120px
}
</style>
