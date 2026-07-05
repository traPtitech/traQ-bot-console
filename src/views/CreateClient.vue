<template>
  <q-page class="create-page q-pa-md">
    <h6>Client新規登録</h6>
    <q-form
      class="create-form"
      @submit="onSubmit"
    >
      <q-banner
        class="app-warning-banner"
        rounded
      >
        <template #avatar>
          <q-icon
            class="text-orange"
            name="warning"
          />
        </template>
        <router-link to="/docs/client">
          Clientマニュアル
        </router-link>と
        <router-link to="/docs/client/rule">
          Client利用ルール
        </router-link>をよく読んでから使用してください。
      </q-banner>
      <q-input
        v-model="name"
        outlined
        stack-label
        label="Client名"
        counter
        maxlength="32"
        :rules="[val => val && val.length > 0 || '必須項目です']"
        hint=""
      />
      <q-input
        v-model="description"
        outlined
        autogrow
        stack-label
        label="説明"
        type="textarea"
        hint="使用用途等を入力してください"
        :rules="[val => val && val.length > 0 || '必須項目です']"
      />
      <q-input
        v-model="callbackUrl"
        outlined
        stack-label
        label="リダイレクト先URL"
        hint="OAuth承認後のリダイレクト先のURLを入力してください"
        :rules="[val => val && urlRegex.test(val) || '有効なURLを入力してください']"
      />
      <fieldset class="scope-field">
        <legend>スコープ</legend>
        <q-option-group
          v-model="scopes"
          :options="scopeOptionsWithLabels"
          type="checkbox"
        />
        <div class="scope-field__hint">
          Client登録後変更することはできません
        </div>
      </fieldset>
      <q-checkbox
        v-model="accept"
        label="Client利用ルールに同意する"
      />
      <div class="create-actions">
        <q-btn
          label="登録"
          color="primary"
          type="submit"
          unelevated
        />
      </div>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { traq } from '../api'
import scopeOptions from '../clientScopes'

defineOptions({ name: 'CreateClient' })

const $q = useQuasar()
const router = useRouter()

const name = ref('')
const description = ref('')
const callbackUrl = ref('')
const scopes = ref<any[]>([])
const accept = ref(false)
const urlRegex = /http(s)?:\/\/([\w-]+.)+[\w-]+(\/[\w- ./?%&=]*)?/i
const scopeOptionsWithLabels = scopeOptions.map(opt => ({
  label: `${opt.label} (${opt.value})`,
  value: opt.value,
}))

const onSubmit = async () => {
  if (accept.value !== true) {
    $q.notify({
      icon: 'error_outline',
      color: 'red-5',
      textColor: 'white',
      message: 'Client利用ルールに同意する必要があります'
    })
  } else if (scopes.value.length === 0) {
    $q.notify({
      icon: 'error_outline',
      color: 'red-5',
      textColor: 'white',
      message: 'スコープを一つ以上選択してください'
    })
  } else {
    $q.loading.show({ delay: 400 })
    try {
      const res = await traq.createClient({
        name: name.value,
        description: description.value,
        callbackUrl: callbackUrl.value,
        scopes: scopes.value
      })
      await router.push(`/clients/${res.data.id}`)
      $q.notify({
        icon: 'done',
        color: 'primary',
        textColor: 'white',
        message: 'Clientが登録されました'
      })
    } catch (e: any) {
      if (e.response && e.response.status === 409) {
        $q.notify({
          icon: 'error_outline',
          color: 'red-5',
          textColor: 'white',
          message: '既に使われているIDです'
        })
      } else {
        console.error(e)
        $q.notify({
          icon: 'error_outline',
          color: 'red-5',
          textColor: 'white',
          message: '登録時にエラーが発生しました'
        })
      }
    } finally {
      $q.loading.hide()
    }
  }
}
</script>
