<template lang="pug">
  q-page.q-pa-md.q-gutter-md
    q-list.rounded-borders(bordered separator)
      q-item-label(header) あなたが作成したClient

      q-item(v-if="loading")
        q-item-section
          q-item-label
            q-skeleton(type="text")
          q-item-label(caption lines="1")
            q-skeleton(type="text")

      q-item(v-else v-for="cl in myClients" :key="cl.id" clickable :to="`/clients/${cl.id}`")
        q-item-section
          q-item-label {{ cl.name }}
          q-item-label(caption lines="1") {{ cl.description }}

    q-list.rounded-borders(bordered separator v-if="!loading && othersClients.length > 0")
      q-item-label(header) 他の人が作成したClient (管理者権限による表示)

      q-item(v-for="cl in othersClients" :key="cl.id" clickable :to="`/clients/${cl.id}`")
        q-item-section
          q-item-label {{ cl.name }}
          q-item-label(caption lines="1") {{ cl.description }}
        q-item-section(side top)
          q-item-label(caption) @{{ cl.developerName }}によって作成

    div.q-pa-md
      q-btn.full-width(color="primary" unelevated to="/clients/create") 新規作成

</template>

<script>
import { mapState } from 'vuex'
import { getClients, getUserIconURL } from '../api'

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
      return this.clients.filter(w => w.developerId === this.userInfo.userId)
    },
    othersClients () {
      return this.clients.filter(w => w.developerId !== this.userInfo.userId)
    },
    ...mapState([
      'userInfo'
    ])
  },
  methods: {
    async getClients () {
      this.loading = true
      try {
        const res = await getClients()
        for (const cl of res.data) {
          cl.developerName = await this.$store.dispatch('fetchUserName', cl.developerId)
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
      }
    },
    getUserIconURL
  }
}
</script>
