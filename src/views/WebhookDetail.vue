<template lang="pug">
  q-page.q-pa-md.q-gutter-sm
    template(v-if="webhook !== null")
      h6 {{ webhook.displayName }} Webhookの詳細
      q-avatar
        img(:src="getUserIconURL(webhook.botUserName)")
      q-input(label="Webhook ID" v-model="webhook.webhookId" readonly)
      q-input(label="Webhook User ID" v-model="webhook.botUserId" readonly)
      q-input(label="Webhook名" v-model="webhook.displayName" readonly)
        template(slot="after")
          q-btn(round dense flat icon="edit")
      q-input(label="説明" v-model="webhook.description" readonly type="textarea" autogrow)
        template(slot="after")
          q-btn(round dense flat icon="edit")
      q-input(label="投稿先チャンネル" v-model="channel.channelName" readonly)
        template(slot="after")
          q-btn(round dense flat icon="edit")
      q-input(label="作成日時" v-model="webhook.createdAt" readonly)
      q-input(label="更新日時" v-model="webhook.updatedAt" readonly)
      q-btn.full-width(color="primary" unelevated :to='`/webhooks/tester?id=${webhook.webhookId}`') テスト
      q-btn.full-width(color="negative" unelevated @click="onDeleteBtnClicked") 削除

    template(v-else)
      span 読み込み中...
</template>

<script>
import { getWebhook, deleteWebhook, getUserIconURL } from '../api'

export default {
  name: 'WebhookDetail',
  data () {
    return {
      loading: false,
      webhook: null,
      channel: null
    }
  },
  async created () {
    await this.fetchData()
  },
  watch: {
    '$route': 'fetchData'
  },
  methods: {
    async fetchData () {
      this.loading = true
      this.webhook = null
      this.$q.loading.show({ delay: 400 })
      try {
        const webhook = (await getWebhook(this.$route.params.id)).data
        webhook.botUserName = await this.$store.dispatch('fetchUserName', webhook.botUserId)
        this.webhook = webhook
        this.channel = this.$store.getters.getChannel(webhook.channelId)
        if (this.channel === null) {
          await this.$store.dispatch('updateChannelList')
          this.channel = this.$store.getters.getChannel(webhook.channelId)
        }
      } catch (e) {
        console.error(e)
        this.$q.notify({
          icon: 'error_outline',
          color: 'red-5',
          textColor: 'white',
          message: '取得時にエラーが発生しました'
        })
      } finally {
        this.loading = false
        this.$q.loading.hide()
      }
    },
    onDeleteBtnClicked () {
      this.$q.dialog({
        title: '確認',
        message: '本当に削除しますか？',
        ok: {
          color: 'negative',
          unelevated: true
        },
        cancel: {
          unelevated: true
        },
        persistent: true
      }).onOk(async () => {
        this.$q.loading.show({ delay: 400 })
        try {
          await deleteWebhook(this.webhook.webhookId)
          this.$router.push('/webhooks', () => {
            this.$q.notify({
              icon: 'done',
              color: 'primary',
              textColor: 'white',
              message: '削除に成功しました'
            })
          })
        } catch (e) {
          console.error(e)
          this.$q.notify({
            icon: 'error_outline',
            color: 'red-5',
            textColor: 'white',
            message: '削除時にエラーが発生しました'
          })
        } finally {
          this.$q.loading.hide()
        }
      })
    },
    getUserIconURL
  }
}
</script>
