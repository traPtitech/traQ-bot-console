<template lang="pug">
  q-page.q-pa-md.q-gutter-md
    template(v-if="!loading")
      q-list.rounded-borders(bordered separator)
        q-item-label(header) あなたが作成したClient

        q-item(v-for="cl in myClients" :key="cl.clientId" clickable :to="`/clients/${cl.clientId}`")
          q-item-section
            q-item-label {{ cl.name }}
            q-item-label(caption lines="1") {{ cl.description }}

      q-list.rounded-borders(bordered separator v-if="othersClients.length > 0")
        q-item-label(header) 他の人が作成したWebhook (管理者権限による表示)

        q-item(v-for="cl in othersClients" :key="cl.webhookId" clickable :to="`/clients/${cl.clientId}`")
          q-item-section
            q-item-label {{ cl.name }}
            q-item-label(caption lines="1") {{ cl.description }}
          q-item-section(side top)
            q-item-label(caption) @{{ cl.creatorName }}によって作成

    div.q-pa-md
      q-btn.full-width(color="primary" unelevated to="/clients/create") 新規作成

</template>

<script>
import { mapState } from 'vuex'
import { traq, getUserIconURL } from '../api'

export default {
  name: 'Clients',
  data () {
    return {
      loading: false,
      clients: []
    }
  },
  async mounted () {
    await this.getClients()
  },
  computed: {
    myClients () {
      return this.clients.filter(w => w.creatorId === this.userInfo.userId)
    },
    othersClients () {
      return this.clients.filter(w => w.creatorId !== this.userInfo.userId)
    },
    ...mapState([
      'userInfo'
    ])
  },
  methods: {
    async getClients () {
      this.loading = true
      this.$q.loading.show({ delay: 400 })
      try {
        const res = await traq.getClients()
        for (const cl of res.data) {
          cl.creatorName = await this.$store.dispatch('fetchUserName', cl.creatorId)
        }
        this.clients = res.data
      } catch (e) {
        console.error(e)
        this.$q.notify({
          icon: 'error_outline',
          color: 'red-5',
          textColor: 'white',
          message: '一覧の取得時にエラーが発生しました'
        })
      } finally {
        this.loading = false
        this.$q.loading.hide()
      }
    },
    getUserIconURL
  }
}
</script>
