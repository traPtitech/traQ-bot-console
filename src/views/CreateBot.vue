<template lang="pug">
  q-page.q-pa-md.q-gutter-md
    h6 BOT新規登録
    q-form.q-gutter-md(@submit="onSubmit")
      q-banner.bg-grey-3.text-black(rounded)
        template(slot="avatar")
          q-icon.text-orange(name="warning")
        router-link(to="/docs/bot") BOTマニュアル
        | と
        router-link(to="/docs/bot/rule") BOT利用ルール
        | をよく読んでから使用してください。
      q-input(v-model="name" outlined stack-label label="BOT ID" counter maxlength="16" prefix="@BOT_"
        :rules="[val => val && botNameRegex.test(val) || '有効な文字列を入力してください']" hint="使用可能な文字はa-zA-Z0-9_-です。自動的に接頭辞`BOT_`が付与されます")
      q-input(v-model="displayName" outlined stack-label label="BOT表示名" counter maxlength="32"
        :rules="[val => val && val.length > 0 || '必須項目です']" hint="BOTが投稿したメッセージに表示されます")
      q-input(v-model="description" outlined autogrow stack-label label="説明" type="textarea" hint="使用用途等を入力してください"
        :rules="[val => val && val.length > 0 || '必須項目です']")
      q-input(v-model="webhookUrl" outlined stack-label label="BOTサーバーエンドポイント" hint="traQのイベント送信先のURLを入力してください"
        :rules="[val => val && urlRegex.test(val) || '有効なURLを入力してください']")
      q-checkbox(v-model="accept" label="BOT利用ルールに同意する")
      div
        q-btn.float-right(label="登録" color="primary" type="submit" unelevated)

</template>

<script>
import { traq } from '../api'

export default {
  name: 'CreateBot',
  data () {
    return {
      name: '',
      displayName: '',
      description: '',
      webhookUrl: '',
      accept: false,
      urlRegex: /http(s)?:\/\/([\w-]+.)+[\w-]+(\/[\w- ./?%&=]*)?/i,
      botNameRegex: /^[a-zA-Z0-9_-]{1,16}$/i
    }
  },
  methods: {
    async onSubmit () {
      if (this.accept !== true) {
        this.$q.notify({
          icon: 'error_outline',
          color: 'red-5',
          textColor: 'white',
          message: 'BOT利用ルールに同意する必要があります'
        })
      } else {
        this.$q.loading.show({ delay: 400 })
        try {
          const res = await traq.createBots({
            name: this.name,
            displayName: this.displayName,
            description: this.description,
            webhookUrl: this.webhookUrl
          })
          this.$router.push(`/bots/${res.data.botId}`, () => {
            this.$q.notify({
              icon: 'done',
              color: 'primary',
              textColor: 'white',
              message: 'BOTが登録されました'
            })
          })
        } catch (e) {
          if (e.response && e.response.status === 409) {
            this.$q.notify({
              icon: 'error_outline',
              color: 'red-5',
              textColor: 'white',
              message: '既に使われているIDです'
            })
          } else if (e.response && e.response.data.message === 'prohibited webhook host') {
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
              message: '登録時にエラーが発生しました'
            })
          }
        } finally {
          this.$q.loading.hide()
        }
      }
    }
  }
}
</script>
