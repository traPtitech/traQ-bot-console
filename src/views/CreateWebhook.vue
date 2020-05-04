<template lang="pug">
  q-page.q-pa-md.q-gutter-md
    h6 Webhook新規作成
    q-form.q-gutter-md(@submit="onSubmit")
      q-banner.bg-grey-3.text-black(rounded)
        template(slot="avatar")
          q-icon.text-orange(name="warning")
        router-link(to="/docs/webhook") Webhookマニュアル
        | と
        router-link(to="/docs/webhook/rule") Webhook利用ルール
        | をよく読んでから使用してください。
      q-input(v-model="name" outlined stack-label label="Webhook名(表示名)" counter maxlength="32"
        :rules="[val => val && val.length > 0 || '必須項目です']" hint="Webhookが投稿したメッセージに表示されます")
      q-input(v-model="description" outlined autogrow stack-label label="説明" type="textarea" hint="使用用途等を入力してください"
        :rules="[val => val && val.length > 0 || '必須項目です']")
      q-select(v-model="targetChannel" outlined clearable use-input hide-selected fill-input input-debounce="0" stack-label label="投稿先チャンネル" :options="channelOptions" option-value="channelName" option-label="channelName"
        :rules="[val => val || '必須項目です']" @filter="channelFilterFn" :loading="loadingChannel" :disable="loadingChannel" hint="プライベートなチャンネルは指定できません")
        template(slot="no-option")
          q-item
            q-item-section.text-grey チャンネルが表示されない場合は右の更新ボタンを押してください
        template(slot="after")
          q-btn(round dense flat icon="refresh" @click="fetchChannels")
      q-input(v-model="secret" outlined stack-label label="Webhookシークレット" hint="Secure Webhookを使用しない場合は空欄にしてください。シークレットは後から見ることはできないので、記録しておいてください。")
      q-checkbox(v-model="accept" label="Webhook利用ルールに同意する")
      div
        q-btn.float-right(label="作成" color="primary" type="submit" unelevated)
</template>

<script>
import { traq } from '../api'
import { mapGetters } from 'vuex'

export default {
  name: 'CreateWebhook',
  data () {
    return {
      name: '',
      description: '',
      targetChannel: null,
      channelOptions: [],
      secret: '',
      accept: false,
      loadingChannel: false
    }
  },
  computed: {
    ...mapGetters([
      'getChannelArray'
    ])
  },
  methods: {
    async fetchChannels () {
      this.loadingChannel = true
      try {
        this.targetChannel = null
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
    async onSubmit () {
      if (this.accept !== true) {
        this.$q.notify({
          icon: 'error_outline',
          color: 'red-5',
          textColor: 'white',
          message: 'Webhook利用ルールに同意する必要があります'
        })
      } else {
        this.$q.loading.show({ delay: 400 })
        try {
          const res = await traq.createWebhook({
            name: this.name,
            description: this.description,
            channelId: this.targetChannel.channelId,
            secret: this.secret
          })
          this.$router.push(`/webhooks/${res.data.id}`, () => {
            this.$q.notify({
              icon: 'done',
              color: 'primary',
              textColor: 'white',
              message: 'Webhookが作成されました'
            })
          })
        } catch (e) {
          console.error(e)
          this.$q.notify({
            icon: 'error_outline',
            color: 'red-5',
            textColor: 'white',
            message: '作成時にエラーが発生しました'
          })
        } finally {
          this.$q.loading.hide()
        }
      }
    }
  }
}
</script>
