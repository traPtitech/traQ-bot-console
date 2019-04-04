<template lang="pug">
  q-page.q-pa-md.q-gutter-md
    template(v-if="webhook !== null")
      h6 {{ webhook.displayName }} Webhookの詳細
      div.q-gutter-md
        div.row.q-col-gutter-md
          div.col.col-md-2.col-sm-3
            div.row
              span.col-4.col-sm-12
                q-uploader(v-if="editingIcon" flat style="max-width: 100%" :multiple="false" accept="image/jpeg, image/png, image/gif" :max-file-size="2048*1024" method="PUT" :url="iconUploadURL" :headers="iconUploadHeaders" field-name="file" @uploaded="onUploadIconSuccess" @failed="onUploadIconFailed")
                  template(slot="header" slot-scope="scope")
                    div.row.no-wrap.items-center.q-pa-sm.q-gutter-xs
                      q-spinner(v-if="scope.isUploading" class="q-uploader__spinner")
                      div.col
                        div.q-uploader__title 2MBまでのpng,jpg,gif
                        div.q-uploader__subtitle {{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }}
                      q-btn(v-if="scope.editable && scope.queuedFiles.length === 0" icon="add_box" @click="scope.pickFiles" round dense flat)
                      q-btn(v-if="scope.editable && scope.queuedFiles.length > 0" icon="cloud_upload" @click="scope.upload" round dense flat)
                q-img(v-else :src="getUserIconURL(webhook.botUserName)")
              div.col-5.col-md-12.col-sm-12.q-pa-md
                q-btn.full-width(unelevated color="grey" @click="editingIcon = !editingIcon") {{ editingIcon ? 'キャンセル' : 'アイコン変更'}}
          div.col-12.col-md-10.col-sm-9
            q-form.col(@submit="onSubmit")
              q-input(label="Webhook ID" v-model="webhook.webhookId" readonly hint='')
              q-input(label="Webhook User ID" v-model="webhook.botUserId" readonly hint='')
              q-input(label="Webhook名" stack-label v-model="name.value" :readonly="!editing" :counter="editing" maxlength="32" :rules="[val => val && val.length > 0 || '必須項目です']")
              q-input(label="説明" stack-label v-model="description.value" :readonly="!editing" type="textarea" autogrow :rules="[val => val && val.length > 0 || '必須項目です']")
              q-select(v-model="channel.value" :readonly="!editing" :clearable="editing" use-input hide-selected input-debounce="0" stack-label label="投稿先チャンネル" :options="channelOptions" option-value="channelName" option-label="channelName"
                :rules="[val => val || '必須項目です']" @filter="channelFilterFn" :loading="loadingChannel" :disable="loadingChannel")
                template(slot="no-option")
                  q-item
                    q-item-section.text-grey チャンネルが表示されない場合は右の更新ボタンを押してください
                template(v-if="editing" slot="after")
                  q-btn(round dense flat icon="refresh" @click="fetchChannels")
              q-input(v-model="secret" stack-label label="Webhookシークレット" :readonly="!editing" hide-hint hint="Secure Webhookを使用しない場合は空欄にしてください")
              q-input(label="作成日時" hint='' v-model="webhook.createdAt" readonly)
              div.row.q-gutter-sm(v-if="editing")
                q-btn.col.btn-fixed-width(label="キャンセル" unelevated @click="cancelEditing")
                q-btn.col.btn-fixed-width(label="送信" color="primary" type="submit" unelevated)
            div.row.q-gutter-sm(v-if="!editing")
              q-btn.col.btn-fixed-width(color="primary" unelevated :to='`/webhooks/tester?id=${webhook.webhookId}`') テスト
              q-btn.col.btn-fixed-width(color="secondary" unelevated @click="startEditing") 編集
              q-btn.col.btn-fixed-width(color="negative" unelevated @click="onDeleteBtnClicked") 削除

    template(v-else)
      span 読み込み中...
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { getWebhook, deleteWebhook, getUserIconURL, patchWebhook, baseURL } from '../api'

export default {
  name: 'WebhookDetail',
  data () {
    return {
      loading: false,
      webhook: null,
      loadingChannel: false,
      channelOptions: [],
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
      channel: {
        value: null,
        temp: null
      },
      secret: '表示されません'
    }
  },
  computed: {
    ...mapGetters([
      'getChannelArray'
    ]),
    ...mapState([
      'authToken'
    ]),
    iconUploadURL () {
      return `${baseURL}/webhooks/${this.$route.params.id}/icon`
    },
    iconUploadHeaders () {
      return [{ name: 'Authorization', value: `Bearer ${this.authToken}` }]
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
        this.name.value = webhook.displayName
        this.description.value = webhook.description
        this.webhook = webhook
        this.channel.value = this.$store.getters.getChannel(webhook.channelId)
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
    async fetchChannels () {
      this.loadingChannel = true
      try {
        this.channel.value = null
        await this.$store.dispatch('updateChannelList')
      } catch (e) {
        console.error(e)
        this.$q.notify({
          icon: 'error_outline',
          color: 'red-5',
          textColor: 'white',
          message: '更新時にエラーが発生しました'
        })
      } finally {
        this.loadingChannel = false
      }
    },
    channelFilterFn (val, update) {
      if (val === '') {
        update(() => { this.channelOptions = this.getChannelArray })
      } else {
        update(() => {
          const l = val.toLowerCase()
          this.channelOptions = this.getChannelArray.filter(v => v.channelName.toLowerCase().indexOf(l) > -1)
        })
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
    getUserIconURL,
    startEditing () {
      this.name.temp = this.name.value
      this.description.temp = this.description.value
      this.channel.temp = this.channel.value
      this.secret = ''
      this.editing = true
    },
    cancelEditing () {
      this.name.value = this.name.temp
      this.description.value = this.description.temp
      this.channel.value = this.channel.temp
      this.secret = '表示されません'
      this.editing = false
    },
    async onSubmit () {
      this.$q.loading.show({ delay: 400 })
      try {
        await patchWebhook(this.webhook.webhookId, {
          name: this.name.value,
          description: this.description.value,
          channelId: this.channel.value.channelId,
          secret: this.secret
        })
        this.$q.notify({
          icon: 'done',
          color: 'primary',
          textColor: 'white',
          message: 'Webhookが編集されました'
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
    onUploadIconSuccess () {
      this.editingIcon = false
      this.$q.notify({
        icon: 'done',
        color: 'primary',
        textColor: 'white',
        message: 'アイコンが変更されました。\nBOT Console上では、アイコン画像キャッシュの有効期限が切れた後に表示が反映されます。'
      })
    },
    onUploadIconFailed () {
      this.$q.notify({
        icon: 'error_outline',
        color: 'red-5',
        textColor: 'white',
        message: 'アイコンの変更でエラーが発生しました'
      })
    }
  }
}
</script>
