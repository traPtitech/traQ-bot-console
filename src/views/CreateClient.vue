<template lang="pug">
  q-page.q-pa-md.q-gutter-md
    h6 Client新規登録
    q-form.q-gutter-md(@submit="onSubmit")
      q-banner.bg-grey-3.text-black(rounded)
        template(#avatar)
          q-icon.text-orange(name="warning")
        router-link(to="/docs/client") Clientマニュアル
        | と
        router-link(to="/docs/client/rule") Client利用ルール
        | をよく読んでから使用してください。
      q-input(v-model="name" outlined stack-label label="Client名" counter maxlength="32"
        :rules="[val => val && val.length > 0 || '必須項目です']" hint="")
      q-input(v-model="description" outlined autogrow stack-label label="説明" type="textarea" hint="使用用途等を入力してください"
        :rules="[val => val && val.length > 0 || '必須項目です']")
      q-input(v-model="callbackUrl" outlined stack-label label="リダイレクト先URL" hint="OAuth承認後のリダイレクト先のURLを入力してください"
        :rules="[val => val && urlRegex.test(val) || '有効なURLを入力してください']")
      q-field(v-model="scopes" outlined stack-label label="スコープ" hint="Client登録後変更することはできません"
          :rules="[val => val && val.length > 0 || '一つ以上選択してください']")
        template(v-slot:control)
          q-option-group(v-model="scopes" :options="scopeOptions" type="checkbox")
      q-checkbox(v-model="accept" label="Client利用ルールに同意する")
      div
        q-btn.float-right(label="登録" color="primary" type="submit" unelevated)

</template>

<script>
import { traq } from '../api'
import scopeOptions from '../clientScopes'

export default {
  name: 'CreateClient',
  data () {
    return {
      name: '',
      description: '',
      callbackUrl: '',
      scopes: [],
      scopeOptions: scopeOptions.map((opt) => ({
        label: `${opt.label} (${opt.value})`,
        value: opt.value,
      })),
      accept: false,
      urlRegex: /http(s)?:\/\/([\w-]+.)+[\w-]+(\/[\w- ./?%&=]*)?/i
    }
  },
  methods: {
    async onSubmit () {
      if (this.accept !== true) {
        this.$q.notify({
          icon: 'error_outline',
          color: 'red-5',
          textColor: 'white',
          message: 'Client利用ルールに同意する必要があります'
        })
      } else {
        this.$q.loading.show({ delay: 400 })
        try {
          const res = await traq.createClient({
            name: this.name,
            description: this.description,
            callbackUrl: this.callbackUrl,
            scopes: this.scopes
          })
          this.$router.push(`/clients/${res.data.id}`, () => {
            this.$q.notify({
              icon: 'done',
              color: 'primary',
              textColor: 'white',
              message: 'Clientが登録されました'
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
    },
    check (val) {
      console.log(val)
      return false
    }
  }
}
</script>
