<template lang="pug">
  q-page.q-pa-md.q-gutter-md
    template(v-if="client === null")
      q-skeleton(tag="h6" type="text")

      div.q-gutter-md
        div.row.q-col-gutter-md
          div.col-12
            q-skeleton(type="rect" style="height: 40em")

    template(v-else)
      h6 {{ client.name }} Clientの詳細
      div.q-gutter-md
        div.row.q-col-gutter-md
          div.col-12
            q-tabs.text-grey(v-model="tab" dense active-color="primary" indicator-color="primary" narrow-indicator align="left")
              q-tab(name="info" label="基本情報")
              q-tab(name="cred" label="認証情報")
            q-separator
            q-tab-panels(v-model="tab" animated)
              q-tab-panel(name="info")
                q-form.col(@submit="onSubmit")
                  q-input(label="Client ID" v-model="client.id" readonly hint='')
                    template(#after)
                      q-icon(name="file_copy" class="cursor-pointer" @click="copyText(client.id)")
                  q-input(label="Client名" stack-label v-model="name.value" :readonly="!editing" :counter="editing" maxlength="32" :rules="[val => val && val.length > 0 || '必須項目です']")
                  q-input(label="説明" stack-label v-model="description.value" :readonly="!editing" type="textarea" autogrow :rules="[val => val && val.length > 0 || '必須項目です']")
                  q-input(label="リダイレクト先URL" stack-label v-model="callbackUrl.value" :readonly="!editing" :counter="editing" :rules="[val => val && urlRegex.test(val) || '有効なURLを入力してください']")
                  q-field(label="権限" stack-label v-model="client.scopes" readonly hint='')
                    template(v-slot:control)
                      q-option-group(v-model="client.scopes" :options="scopeOptions" type="checkbox" disable hint='')
                  q-input(v-if="client.developerId !== userInfo.id" label="作成者" hint='' v-model="client.developerName" readonly)
                  div.row.q-gutter-sm(v-if="editing")
                    q-btn.col.btn-fixed-width(label="キャンセル" unelevated @click="cancelEditing")
                    q-btn.col.btn-fixed-width(label="送信" color="primary" type="submit" unelevated)
                div.row.q-gutter-sm(v-if="!editing")
                  q-btn.col.btn-fixed-width(color="secondary" unelevated @click="startEditing") 編集
                  q-btn.col.btn-fixed-width(color="negative" unelevated @click="onDeleteBtnClicked") 削除
                  q-btn.col.btn-fixed-width(color='warning' unelevated @click="onTransferBtnClicked") 移譲
              q-tab-panel(name="cred")
                p 以下の認証情報の取り扱いに十分注意してください
                q-form
                  q-input(label="Client Secret" v-model="client.secret" :type="hideSecret ? 'password' : 'text'" readonly)
                    template(#after)
                      q-icon(name="file_copy" class="cursor-pointer" :class="{ hidden: hideSecret }" @click="copyText(client.secret)")
                      q-icon(:name="hideSecret ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="hideSecret = !hideSecret")
</template>

<script>
import { mapState } from 'vuex'
import { copyToClipboard } from 'quasar'
import { traq, getUsersOptionItems } from '../api'
import scopeOptions from '../clientScopes'

export default {
  name: 'ClientDetail',
  data () {
    return {
      loading: false,
      tab: 'info',
      client: null,
      editing: false,
      editingIcon: false,
      name: {
        value: '',
        temp: ''
      },
      description: {
        value: '',
        temp: ''
      },
      callbackUrl: {
        value: '',
        temp: ''
      },
      scopeOptions,
      urlRegex: /http(s)?:\/\/([\w-]+.)+[\w-]+(\/[\w- ./?%&=]*)?/i,
      hideSecret: true
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  watch: {
    $route: 'fetchData'
  },
  async created () {
    await this.fetchData()
  },
  methods: {
    async fetchData () {
      this.loading = true
      this.client = null
      try {
        const client = (await traq.getClient(this.$route.params.id, true)).data
        client.developerName = await this.$store.dispatch('fetchUserName', client.developerId)
        this.name.value = client.name
        this.description.value = client.description
        this.callbackUrl.value = client.callbackUrl
        this.client = client
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
          await traq.deleteClient(this.client.id)
          this.$router.push('/clients', () => {
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
    async onTransferBtnClicked () {
      const items = await getUsersOptionItems(this.client.developerId)
      this.$q.dialog({
        title: '移譲',
        message: '誰に移譲しますか？',
        options: {
          type: 'radio',
          model: items[0].value,
          items
        },
        cancel: true,
        persistent: true
      }).onOk(async user => {
        this.$q.dialog({
          title: '移譲',
          message: `本当に@${user.name}に移譲しますか？`,
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
            await traq.editClient(this.client.id, { developerId: user.id })
            this.$router.push('/clients', () => {
              this.$q.notify({
                icon: 'done',
                color: 'primary',
                textColor: 'white',
                message: '移譲に成功しました'
              })
            })
          } catch (e) {
            console.error(e)
            this.$q.notify({
              icon: 'error_outline',
              color: 'red-5',
              textColor: 'white',
              message: '移譲時にエラーが発生しました'
            })
          } finally {
            this.$q.loading.hide()
          }
        })
      })
    },
    startEditing () {
      this.name.temp = this.name.value
      this.description.temp = this.description.value
      this.callbackUrl.temp = this.callbackUrl.value
      this.editing = true
    },
    cancelEditing () {
      this.name.value = this.name.temp
      this.description.value = this.description.temp
      this.callbackUrl.value = this.callbackUrl.temp
      this.editing = false
    },
    async onSubmit () {
      this.$q.loading.show({ delay: 400 })
      try {
        const params = {
          name: this.name.value,
          description: this.description.value,
          callbackUrl: this.callbackUrl.value
        }
        await traq.editClient(this.client.id, params)
        await this.fetchData()
        this.$q.notify({
          icon: 'done',
          color: 'primary',
          textColor: 'white',
          message: 'Clientが編集されました'
        })
        this.editing = false
      } catch (e) {
        console.error(e)
        this.$q.notify({
          icon: 'error_outline',
          color: 'red-5',
          textColor: 'white',
          message: '送信時にエラーが発生しました'
        })
      } finally {
        this.$q.loading.hide()
      }
    },
    async copyText (str) {
      try {
        await copyToClipboard(str)
        this.$q.notify({
          icon: 'done',
          color: 'primary',
          textColor: 'white',
          message: 'コピーしました'
        })
      } catch (e) {
        console.error('copy', e)
        this.$q.notify({
          icon: 'error_outline',
          color: 'red-5',
          textColor: 'white',
          message: 'コピーに失敗しました'
        })
      }
    }
  }
}
</script>
