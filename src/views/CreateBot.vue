<template lang="pug">
  q-page.q-pa-md.q-gutter-md
    h6 BOT新規登録
    q-form.q-gutter-md(@submit="onSubmit")
      q-banner.bg-grey-3.text-black(rounded)
        template(#avatar)
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
      q-select(v-model="mode" outlined stack-label label="動作モード" hint="動作モードを選択してください"
        :options="modeOptions" :rules="[val => val && modeOptions.includes(val) || '選択してください']")
      q-input(v-if="mode === 'HTTP'" v-model="endpoint" outlined stack-label label="BOTサーバーエンドポイント" hint="traQのイベント送信先のURLを入力してください"
        :rules="[modeRule]" reactive-rules)
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
      mode: '',
      endpoint: '',
      accept: false,
      modeOptions: ['HTTP', 'WebSocket'],
      urlRegex: /http(s)?:\/\/([\w-]+.)+[\w-]+(\/[\w- ./?%&=]*)?/i,
      botNameRegex: /^[a-zA-Z0-9_-]{1,16}$/i
    }
  },
  computed: {
    modeRule () {
      return val => {
        if (this.mode === 'HTTP') {
          return (val && this.urlRegex.test(val)) || '有効なURLを入力してください'
        } else {
          return true
        }
      }
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
          const params = {
            name: this.name,
            displayName: this.displayName,
            description: this.description,
            mode: this.mode
          }
          if (this.mode === 'HTTP') {
            params.endpoint = this.endpoint
          }
          const res = await traq.createBot(params)
          this.$router.push(`/bots/${res.data.id}`, () => {
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
          } else if (e.response && e.response.data.message === 'endpoint: must not be internal url.') {
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
