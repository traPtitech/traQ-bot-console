<template lang="pug">
  q-page.q-pa-md.q-gutter-md
    template(v-if="bot !== null")
      h6 {{ bot.displayName }} (@{{ bot.botUserName }})の詳細
        q-space
        div.q-gutter-sm
          template
            q-badge(v-if="bot.state === 0" color="grey") 停止
            q-badge(v-else-if="bot.state === 1" color="green") 有効
            q-badge(v-else-if="bot.state === 2" color="amber") 一時停止
              q-tooltip 何らかの原因で一時停止されています。アクティベーションしてください。
            q-badge(v-else) 不明な状態({{ bot.state }}
          q-badge(v-if="bot.privileged" color="orange") Privileged

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
                q-img(v-else :src="getUserIconURL(bot.botUserName)")
              div.col-5.col-md-12.col-sm-12.q-pa-md
                q-btn.full-width(unelevated color="grey" @click="editingIcon = !editingIcon") {{ editingIcon ? 'キャンセル' : 'アイコン変更'}}
          div.col-12.col-md-10.col-sm-9
            q-tabs.text-grey(v-model="tab" dense active-color="primary" indicator-color="primary" narrow-indicator align="left")
              q-tab(name="info" label="基本情報")
              q-tab(name="cred" label="認証情報")
              q-tab(name="events" label="購読イベント")
              q-tab(name="channels" label="チャンネル")
              q-tab(name="logs" label="イベントログ")
            q-separator
            q-tab-panels(v-model="tab" animated)
              q-tab-panel(name="info")
                q-form(@submit="onSubmit")
                  q-input(label="BOT ID" v-model="botId" readonly hint='')
                  q-input(label="BOT User ID" v-model="bot.botUserId" readonly hint='')
                    template(slot="after")
                      q-icon(name="file_copy" class="cursor-pointer" @click="copyText(bot.botUserId)")
                  q-input(label="BOT表示名" stack-label v-model="displayName" :readonly="!editing" :counter="editing" maxlength="32" hide-hint hint="BOTが投稿したメッセージに表示されます"
                    :rules="[val => val && val.length > 0 || '必須項目です']")
                  q-input(label="説明" stack-label v-model="description" :readonly="!editing" autogrow type="textarea" hide-hint hint="使用用途等を入力してください"
                    :rules="[val => val && val.length > 0 || '必須項目です']")
                  q-input(label="BOTサーバーエンドポイント" stack-label v-model="webhookUrl" :readonly="!editing" hide-hint  hint="traQのイベント送信先のURLを入力してください"
                    :rules="[val => val && urlRegex.test(val) || '有効なURLを入力してください']")
                  div.row.q-gutter-sm(v-if="editing")
                    q-btn.col.btn-fixed-width(label="キャンセル" unelevated @click="cancelEditing")
                    q-btn.col.btn-fixed-width(label="送信" color="primary" type="submit" unelevated)
                div.row.q-gutter-sm
                  template(v-if="!editing")
                    template
                      q-btn.col.btn-fixed-width(v-if="bot.state === 1" unelevated color="warning" @click="onDeactivateBtnClicked") 停止
                      q-btn.col.btn-fixed-width(v-else unelevated color="primary" @click="onActivateBtnClicked") アクティベーション
                    q-btn.col.btn-fixed-width(color="secondary" unelevated @click="startEditing") 基本情報編集
                    q-btn.col.btn-fixed-width(unelevated color='negative' @click="onDeleteBtnClicked") 削除
              q-tab-panel(name="cred")
                p 以下の認証情報の取り扱いに十分注意してください
                q-form
                  q-input(label="Verification Code" :value="bot.verificationCode" :type="hideVerificationCode ? 'password' : 'text'" readonly)
                    template(slot="after")
                      q-icon(name="file_copy" class="cursor-pointer" :class="{ hidden: hideVerificationCode }" @click="copyText(bot.verificationCode)")
                      q-icon(:name="hideVerificationCode ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="hideVerificationCode = !hideVerificationCode")
                  q-input(label="BOT Access Token" :value="bot.accessToken" :type="hideAccessToken ? 'password' : 'text'" readonly)
                    template(slot="after")
                      q-icon(name="file_copy" class="cursor-pointer" :class="{ hidden: hideAccessToken }" @click="copyText(bot.accessToken)")
                      q-icon(:name="hideAccessToken ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="hideAccessToken = !hideAccessToken")
                  q-input(label="BOTインストールコード" :value="bot.botCode" :type="hideBotCode ? 'password' : 'text'" hint="" readonly)
                    template(slot="after")
                      q-icon(name="file_copy" class="cursor-pointer" :class="{ hidden: hideBotCode }" @click="copyText(bot.botCode)")
                      q-icon(:name="hideBotCode ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="hideBotCode = !hideBotCode")
                  div
                    q-btn.full-width(color="negative" unelevated @click="onRevokeBtnClicked") 再発行
              q-tab-panel(name="events")
                p 可能な限り最小の設定にしてください。一部のイベントには特権が必要です。
                div(v-for="(evs, category) in events" :key="category")
                  span.text-caption {{ category }}
                  div
                    span(v-for="(meta, ev) in evs" :key="ev")
                      q-checkbox(v-if="!meta.always" v-model="checkedEvents" :val="ev" :label="ev" :disable="meta.privileged && !bot.privileged" keep-color :color="meta.privileged ? 'orange': ''")
                        q-tooltip {{ meta.description }}
                      q-checkbox(v-else :value="true" :label="ev" disable keep-color)
                        q-tooltip {{ meta.description }}
                div.q-pa-md
                  q-btn.full-width(:disable="!subscribeEventsChanged" unelevated color="primary" @click="onChangeEventBtnClicked") 変更
              // TODO fix height issue
              q-tab-panel(name="channels" style="min-height: 500px;")
                p BOTが参加しているチャンネル一覧
                q-list(separator bordered)
                  q-item(v-for="id in installedChannels" :key="id")
                    q-item-section
                      q-item-label {{ getChannel(id).channelName }}
                      q-item-label(caption) {{ id }}
                    q-item-section(side)
                      div.text-grey-8.q-gutter-xs
                        q-btn(size="12px" flat dense round icon="delete" @click="onRemoveBotFromChannelBtnClicked(id)")
                  q-item
                    q-item-section
                      q-select(v-model="addingChannel" dense borderless clearable use-input hide-selected input-debounce="0" :options="channelOptions" option-value="channelName" option-label="channelName" @filter="channelFilterFn" :loading="loadingChannels" :disable="loadingChannels")
                        template(slot="no-option")
                          q-item
                            q-item-section.text-grey チャンネルが表示されない場合は右の更新ボタンを押してください
                        template(slot="append")
                          q-btn(round dense flat icon="refresh" @click="fetchChannels")
                        template(slot="after")
                          q-btn(:disable="addingChannel === null" round dense flat icon="add" @click="onAddBotToChannelBtnClicked(addingChannel.channelId)")
              q-tab-panel(name="logs")
                q-table(:columns="eventLogsColumns" :data="eventLogs" :loading="loadingEventLogs" flat row-key="requestId" title="最近のBOTイベント")
                  template(#top-right)
                    q-btn(round dense flat icon="refresh" @click="fetchEventLogs" :disable="loadingEventLogs")
                  template(#body="props")
                    q-tr.text-right(:props="props")
                      q-td(key="code" auto-width)
                        q-badge(v-if="props.row.code === -1" color="negative") NE
                        q-badge(v-else-if="props.row.code === 204" color="primary") OK
                        q-badge(v-else-if="props.row.code >= 400 || props.row.code < 200" color="negative") NG
                        q-badge(v-else color="warning") {{ props.row.code }}
                      q-td(key="requestId" auto-width) {{ props.row.requestId }}
                      q-td(key="event") {{ props.row.event }}
                      q-td(key="dateTime") {{ dayjs(props.row.dateTime).format('YY/MM/DD HH:mm:ss.SSS') }}
                div.q-gutter-sm
                  div.text-caption.float-left
                    q-badge(color="primary") OK
                    span {{ ' 正常' }}
                  div.text-caption.float-left
                    q-badge(color="negative") NE
                    span {{ ' ネットワークエラー' }}
                  div.text-caption.float-left
                    q-badge(color="negative") NG
                    span {{ ' エラー' }}

    template(v-else)
      span 読み込み中
</template>

<script>
import dayjs from 'dayjs'
import { mapGetters, mapState } from 'vuex'
import {
  baseURL,
  getBotDetail,
  deleteBot,
  getUserIconURL,
  revokeBotTokens,
  changeBotEvents,
  putBotState,
  getBotInstalledChannels,
  removeBotFromChannel,
  addBotToChannel,
  getBotEventLogs,
  getUser,
  patchBot
} from '../api'
import events from '../botEvents'

export default {
  name: 'BotDetail',
  data () {
    return {
      loading: false,
      tab: 'info',
      bot: null,
      installedChannels: [],
      channelOptions: [],
      loadingChannels: false,
      addingChannel: null,
      checkedEvents: [],
      editingIcon: false,
      hideVerificationCode: true,
      hideAccessToken: true,
      hideBotCode: true,
      eventLogsColumns: [
        {
          name: 'code',
          label: '',
          field: 'code'
        },
        {
          name: 'id',
          label: 'Request ID',
          field: 'requestId',
          align: 'left'
        },
        {
          name: 'id',
          label: 'Event',
          field: 'event',
          align: 'right'
        },
        {
          name: 'datetime',
          label: '日時',
          field: 'dateTime'
        }
      ],
      eventLogs: [],
      loadingEventLogs: false,
      displayName: '',
      description: '',
      webhookUrl: '',
      editing: false,
      urlRegex: /http(s)?:\/\/([\w-]+.)+[\w-]+(\/[\w- ./?%&=]*)?/i
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
      return `${baseURL}/bots/${this.botId}/icon`
    },
    iconUploadHeaders () {
      return [{ name: 'Authorization', value: `Bearer ${this.authToken}` }]
    },
    botId () {
      return this.$route.params.id
    },
    events () {
      const categorized = {}
      for (const [name, meta] of Object.entries(events)) {
        if (!categorized[meta.category]) {
          categorized[meta.category] = {}
        }
        categorized[meta.category][name] = meta
      }
      return categorized
    },
    subscribeEventsChanged () {
      const arr = [...this.checkedEvents, ...(this.bot ? this.bot.subscribeEvents : [])]
      const arr2 = arr.filter((x, i, self) => self.indexOf(x) === i && i !== self.lastIndexOf(x))
      return arr.some(v => arr2.indexOf(v) === -1)
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
      this.editing = false
      this.bot = null
      this.$q.loading.show({ delay: 400 })
      try {
        const bot = (await getBotDetail(this.botId)).data
        const botUser = (await getUser(bot.botUserId)).data
        bot.botUserName = botUser.name
        bot.displayName = botUser.displayName
        bot.creatorName = await this.$store.dispatch('fetchUserName', bot.creatorId)
        this.checkedEvents = [...bot.subscribeEvents]
        this.installedChannels = (await getBotInstalledChannels(this.botId)).data
        await this.fetchEventLogs()
        this.bot = bot
        this.displayName = bot.displayName
        this.description = bot.description
        this.webhookUrl = bot.postUrl
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
      this.loadingChannels = true
      try {
        this.addingChannel = null
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
        this.loadingChannels = false
      }
    },
    async fetchEventLogs () {
      this.loadingEventLogs = true
      try {
        this.eventLogs = (await getBotEventLogs(this.botId, 0, 0)).data
      } catch (e) {
        console.error(e)
        this.$q.notify({
          icon: 'error_outline',
          color: 'red-5',
          textColor: 'white',
          message: 'イベントログ更新時にエラーが発生しました'
        })
      } finally {
        this.loadingEventLogs = false
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
    async onSubmit () {
      this.$q.loading.show({ delay: 400 })
      try {
        const params = {}
        if (this.displayName !== this.bot.displayName) {
          params['displayName'] = this.displayName
        }
        if (this.description !== this.bot.description) {
          params['description'] = this.description
        }
        if (this.webhookUrl !== this.bot.postUrl) {
          params['webhookUrl'] = this.webhookUrl
        }
        await patchBot(this.botId, params)
        await this.fetchData()
        this.$q.notify({
          icon: 'done',
          color: 'primary',
          textColor: 'white',
          message: 'BOTが編集されました'
        })
        this.editing = false
      } catch (e) {
        if (e.response && e.response.data.message === 'prohibited webhook host') {
          this.$q.notify({
            icon: 'error_outline',
            color: 'red-5',
            textColor: 'white',
            message: 'エンドポイントURLが無効です'
          })
        } else {
          console.error(e)
          this.$q.notify({
            icon: 'error_outline',
            color: 'red-5',
            textColor: 'white',
            message: '送信時にエラーが発生しました'
          })
        }
      } finally {
        this.$q.loading.hide()
      }
    },
    async onChangeEventBtnClicked () {
      this.loading = true
      this.$q.loading.show({ delay: 400 })
      try {
        await changeBotEvents(this.botId, this.checkedEvents)
        this.bot.subscribeEvents = this.checkedEvents
        this.$q.notify({
          icon: 'done',
          color: 'primary',
          textColor: 'white',
          message: '変更に成功しました'
        })
      } catch (e) {
        console.error(e)
        this.$q.notify({
          icon: 'error_outline',
          color: 'red-5',
          textColor: 'white',
          message: '変更時にエラーが発生しました'
        })
      } finally {
        this.loading = false
        this.$q.loading.hide()
      }
    },
    onActivateBtnClicked () {
      this.$q.dialog({
        title: '確認',
        message: 'OKを押すとPINGイベントが送信され、疎通に成功した場合BOTが有効化されます。',
        ok: {
          color: 'primary',
          unelevated: true
        },
        cancel: {
          unelevated: true
        },
        persistent: true
      }).onOk(async () => {
        this.$q.loading.show({ delay: 400 })
        try {
          await putBotState(this.botId, 'active')
          this.$q.notify({
            icon: 'done',
            color: 'primary',
            textColor: 'white',
            message: 'アクティベーションを開始しました。疎通確認が取れた後に有効化されます。'
          })
        } catch (e) {
          console.error(e)
          this.$q.notify({
            icon: 'error_outline',
            color: 'red-5',
            textColor: 'white',
            message: 'エラーが発生しました'
          })
        } finally {
          this.$q.loading.hide()
        }
      })
    },
    onDeactivateBtnClicked () {
      this.$q.dialog({
        title: '確認',
        message: '本当に停止しますか？',
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
          await putBotState(this.botId, 'inactive')
          await this.fetchData()
        } catch (e) {
          console.error(e)
          this.$q.notify({
            icon: 'error_outline',
            color: 'red-5',
            textColor: 'white',
            message: '無効化時にエラーが発生しました'
          })
        } finally {
          this.$q.loading.hide()
        }
      })
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
          await deleteBot(this.botId)
          this.$router.push('/bots', () => {
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
    onRevokeBtnClicked () {
      this.$q.dialog({
        title: '確認',
        message: '現在のVerification Token, BOT Access Token, BOTインストールコードを全て無効化し、再発行します。よろしいですか？',
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
          await revokeBotTokens(this.botId)
          await this.fetchData()
          this.$q.notify({
            icon: 'done',
            color: 'primary',
            textColor: 'white',
            message: '再発行に成功し、BOTは一時的に停止しました。'
          })
        } catch (e) {
          console.error(e)
          this.$q.notify({
            icon: 'error_outline',
            color: 'red-5',
            textColor: 'white',
            message: 'エラーが発生しました'
          })
        } finally {
          this.$q.loading.hide()
        }
      })
    },
    onRemoveBotFromChannelBtnClicked (channelId) {
      const chName = this.getChannel(channelId).channelName
      this.$q.dialog({
        title: '確認',
        message: `本当に${chName}から削除しますか？`,
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
          await removeBotFromChannel(this.botId, channelId)
          this.installedChannels = (await getBotInstalledChannels(this.botId)).data
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
    onAddBotToChannelBtnClicked (channelId) {
      const chName = this.getChannel(channelId).channelName
      this.$q.dialog({
        title: '確認',
        message: `本当に${chName}に追加しますか？`,
        ok: {
          color: 'primary',
          unelevated: true
        },
        cancel: {
          unelevated: true
        },
        persistent: true
      }).onOk(async () => {
        this.$q.loading.show({ delay: 400 })
        try {
          await addBotToChannel(this.bot.botCode, channelId)
          this.installedChannels = (await getBotInstalledChannels(this.botId)).data
          this.addingChannel = null
        } catch (e) {
          console.error(e)
          this.$q.notify({
            icon: 'error_outline',
            color: 'red-5',
            textColor: 'white',
            message: '追加時にエラーが発生しました'
          })
        } finally {
          this.$q.loading.hide()
        }
      })
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
    startEditing () {
      this.displayName = this.bot.displayName
      this.description = this.bot.description
      this.webhookUrl = this.bot.postUrl
      this.editing = true
    },
    cancelEditing () {
      this.displayName = this.bot.displayName
      this.description = this.bot.description
      this.webhookUrl = this.bot.postUrl
      this.editing = false
    },
    async copyText (str) {
      try {
        await this.$copyText(str)
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
    getUserIconURL,
    dayjs
  }
}
</script>
