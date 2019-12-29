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
                      q-btn(v-if="scope.editable && scope.queuedFiles.length === 0" type="a" icon="add_box" round dense flat)
                        q-uploader-add-trigger
                      q-btn(v-if="scope.editable && scope.queuedFiles.length > 0" icon="cloud_upload" @click="scope.upload" round dense flat)
                q-img(v-else :src="getUserIconURL(webhook.botUserName)")
              div.col-5.col-md-12.col-sm-12.q-pa-md
                q-btn.full-width(unelevated color="grey" @click="editingIcon = !editingIcon") {{ editingIcon ? 'キャンセル' : 'アイコン変更'}}
          div.col-12.col-md-10.col-sm-9
            q-tabs.text-grey(v-model="tab" dense active-color="primary" indicator-color="primary" narrow-indicator align="left")
              q-tab(name="info" label="情報")
              q-tab(name="messages" label="投稿メッセージ")
            q-separator
            q-tab-panels(v-model="tab" animated)
              q-tab-panel(name="info")
                div
                  q-badge(v-if="webhook.secure" color="blue") Secure Webhook
                  q-badge(v-else color="red") Insecure Webhook
                q-form.col(@submit="onSubmit")
                  q-input(label="Webhook ID" v-model="webhook.webhookId" readonly hint='')
                    template(slot="after")
                      q-icon(name="file_copy" class="cursor-pointer" @click="copyText(webhook.webhookId)")
                  q-input(label="Webhook User ID" v-model="webhook.botUserId" readonly hint='')
                  q-input(label="Webhook名" stack-label v-model="name.value" :readonly="!editing" :counter="editing" maxlength="32" :rules="[val => val && val.length > 0 || '必須項目です']")
                  q-input(label="説明" stack-label v-model="description.value" :readonly="!editing" type="textarea" autogrow :rules="[val => val && val.length > 0 || '必須項目です']")
                  q-select(v-model="channel.value" :readonly="!editing" :clearable="editing" use-input hide-selected fill-input input-debounce="0" stack-label label="投稿先チャンネル" :options="channelOptions" option-value="channelName" option-label="channelName"
                    :rules="[val => val || '必須項目です']" @filter="channelFilterFn" :loading="loadingChannel" :disable="loadingChannel" ref="channel")
                    template(slot="no-option")
                      q-item
                        q-item-section.text-grey チャンネルが表示されない場合は右の更新ボタンを押してください
                    template(v-if="editing" slot="after")
                      q-btn(round dense flat icon="refresh" @click="fetchChannels")
                  q-input(v-model="secret.value" stack-label label="Webhookシークレット" :readonly="!editing" hide-hint hint="Webhookシークレットを変更する場合は左のチェックを入れてください")
                    template(v-if="editing" slot="before")
                      q-checkbox(v-model="secret.editing")
                  q-input(v-if="webhook.creatorId !== userInfo.userId" label="作成者" hint='' v-model="webhook.creatorName" readonly)
                  q-input(label="作成日時" hint='' v-model="webhook.createdAt" readonly)
                  div.row.q-gutter-sm(v-if="editing")
                    q-btn.col.btn-fixed-width(label="キャンセル" unelevated @click="cancelEditing")
                    q-btn.col.btn-fixed-width(label="送信" color="primary" type="submit" unelevated)
                div.row.q-gutter-sm(v-if="!editing")
                  q-btn.col.btn-fixed-width(color="primary" unelevated :to='`/webhooks/tester?id=${webhook.webhookId}`') テスト
                  q-btn.col.btn-fixed-width(color="secondary" unelevated @click="startEditing") 編集
                  q-btn.col.btn-fixed-width(color="negative" unelevated @click="onDeleteBtnClicked") 削除
              q-tab-panel(name="messages")
                | このWebhookが投稿した最新のメッセージ10件を見ることができます。
                q-list(separator)
                  q-item(v-for="m in messages" :key="m.messageId")
                    q-item-section
                      q-item-label {{ getChannel(m.parentChannelId).channelName }}
                      q-item-label(caption style="white-space:pre-wrap; word-wrap:break-word;") {{ m.content }}
                    q-item-section(side top)
                      q-item-label(caption) {{ dayjs(m.createdAt).format('YY/MM/DD HH:mm:ss')  }}

    template(v-else)
      span 読み込み中...
</template>

<script>
import dayjs from 'dayjs'
import { mapGetters, mapState } from 'vuex'
import { copyToClipboard } from 'quasar'
import { traq, getUserIconURL, getWebhookMessages, baseURL } from '../api'

export default {
  name: 'WebhookDetail',
  data () {
    return {
      loading: false,
      tab: 'info',
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
      secret: {
        value: '表示されません',
        editing: false
      },
      messages: []
    }
  },
  computed: {
    ...mapGetters([
      'getChannelArray',
      'getChannel'
    ]),
    ...mapState([
      'authToken',
      'userInfo'
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
    $route: 'fetchData'
  },
  methods: {
    async fetchData () {
      this.loading = true
      this.webhook = null
      this.$q.loading.show({ delay: 400 })
      try {
        const webhook = (await traq.getWebhook(this.$route.params.id)).data
        webhook.botUserName = await this.$store.dispatch('fetchUserName', webhook.botUserId)
        webhook.creatorName = await this.$store.dispatch('fetchUserName', webhook.creatorId)
        this.name.value = webhook.displayName
        this.description.value = webhook.description
        this.webhook = webhook
        this.channel.value = this.$store.getters.getChannel(webhook.channelId)
        if (this.channel === null) {
          await this.$store.dispatch('updateChannelList')
          this.channel = this.$store.getters.getChannel(webhook.channelId)
        }
        this.messages = (await getWebhookMessages(this.$route.params.id)).data
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
          await traq.deleteWebhook(this.webhook.webhookId)
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
      this.secret.value = ''
      this.secret.editing = false
      this.editing = true
    },
    cancelEditing () {
      this.name.value = this.name.temp
      this.description.value = this.description.temp
      this.channel.value = this.channel.temp
      this.$refs.channel.updateInputValue(this.channel.value.channelName)
      this.secret.value = '表示されません'
      this.secret.editing = false
      this.editing = false
    },
    async onSubmit () {
      this.$q.loading.show({ delay: 400 })
      try {
        const params = {
          name: this.name.value,
          description: this.description.value,
          channelId: this.channel.value.channelId
        }
        if (this.secret.editing) {
          params.secret = this.secret.value
        }
        await traq.editWebhook(this.webhook.webhookId, params)
        await this.fetchData()
        this.$q.notify({
          icon: 'done',
          color: 'primary',
          textColor: 'white',
          message: 'Webhookが編集されました'
        })
        this.secret.value = '表示されません'
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
    },
    async copyText (str) {
      try {
        copyToClipboard(str)
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
    },
    dayjs
  }
}
</script>
