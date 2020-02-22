<template lang="pug">
  q-page.q-pa-md.q-gutter-sm
    q-list(bordered)
      q-item-label(header) あなたが作成したWebhook / Bot / Client

      q-item(v-if="data === null")
        q-item-section(avatar)
          q-skeleton(type="QAvatar")
        q-item-section
          q-item-label
            q-skeleton(type="text")
          q-item-label(caption)
            q-skeleton(type="text")

      q-item(v-else v-for="datum in data" :key="datum.type + datum.id" :to="datum.link" clickable)
        q-item-section(avatar)
          q-avatar.icon(v-if="datum.iconUrl")
            img(:src="datum.iconUrl")
            q-icon.type-icon(v-if="datum.type === 'webhook'" name="input" color="white")
            q-icon.type-icon(v-if="datum.type === 'bot'" name="tag_faces" color="white")
          q-avatar(v-if="datum.type === 'client'" icon="chrome_reader_mode" color="primary" text-color="white")
        q-item-section
          q-item-label {{ datum.name }}
          q-item-label(caption) {{ datum.description }}
        q-item-section(side top)
          template(v-if="datum.type === 'webhook'")
            q-badge(v-if="datum.secure" color="blue") Secure
            q-badge(v-else color="red") Insecure
          template(v-if="datum.type === 'bot'")
            q-badge(v-if="datum.state === 0" color="grey") 停止
            q-badge(v-else-if="datum.state === 1" color="green") 有効
            q-badge(v-else-if="datum.state === 2" color="amber") 一時停止
            q-badge(v-else) 不明な状態
          template(v-if="datum.type === 'client'")
            q-badge.scope(v-for="scope in datum.scopes" :key="scope") {{ scope }}
</template>

<script>
import { traq, getUserIconURL } from '../api'
import clientScopes from '../clientScopes'

export default {
  name: 'PageHome',
  data () {
    return {
      data: null
    }
  },
  async mounted () {
    const [webhooks, bots, clients] = await Promise.all([
      this.getWebhooks(),
      this.getBots(),
      this.getClients()
    ])

    for (const webhook of webhooks) {
      webhook.type = 'webhook'
      webhook.id = webhook.webhookId
      webhook.name = webhook.displayName
      webhook.iconUrl = getUserIconURL(webhook.botUserName)
      webhook.link = `/webhooks/${webhook.webhookId}`
    }
    for (const bot of bots) {
      bot.type = 'bot'
      bot.id = bot.botId
      bot.name = `@${bot.botUserName}`
      bot.iconUrl = getUserIconURL(bot.botUserName)
      bot.link = `/bots/${bot.botId}`
    }
    for (const client of clients) {
      client.type = 'client'
      client.id = client.clientId
      client.link = `/clients/${client.clientId}`
      client.scopes = client.scopes.map(
        scope => clientScopes.find(s => s.value === scope).label
      )
    }

    this.data = [
      ...webhooks,
      ...bots,
      ...clients
    ].sort((a, b) => {
      if (!a.updatedAt) return 1
      if (!b.updatedAt) return -1
      return new Date(b.updatedAt) - new Date(a.updatedAt)
    })
  },
  methods: {
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
      return (await traq.getClients()).data
    }
  }
}
</script>

<style lang="stylus" scoped>
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
  height: 1.4em
  width: 1.4em
  padding: 0.2em
}

.scope {
  margin-bottom: 0.1em
}
</style>
