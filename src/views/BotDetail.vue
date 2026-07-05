<template>
  <q-page class="q-pa-md q-gutter-md">
    <template v-if="bot === null">
      <q-skeleton
        tag="h6"
        type="text"
        style="margin-bottom: 0"
      />
      <q-skeleton
        type="QBadge"
        style="margin-top: 0; margin-bottom: 3em"
      />
      <div class="q-gutter-md">
        <div class="row q-col-gutter-md">
          <div class="col col-md-2 col-sm-3">
            <div class="row">
              <span class="col-4 col-sm-12">
                <q-skeleton
                  type="rect"
                  style="height: 6em"
                /></span>
              <div class="col-5 col-md-12 col-sm-12 q-pa-md">
                <q-skeleton type="rect" />
              </div>
            </div>
          </div>
          <div class="col-12 col-md-10 col-sm-9">
            <q-skeleton
              type="rect"
              style="height: 30em"
            />
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <h6>
        {{ bot.displayName }} (@{{ bot.botUserName }})の詳細
        <q-space />
        <div class="q-gutter-sm">
          <q-badge
            v-if="bot.state === 0"
            color="grey"
          >
            停止
          </q-badge>
          <q-badge
            v-else-if="bot.state === 1"
            color="green"
          >
            有効
          </q-badge>
          <q-badge
            v-else-if="bot.state === 2"
            color="amber"
          >
            一時停止
            <q-tooltip>何らかの原因で一時停止されています。アクティベーションしてください。</q-tooltip>
          </q-badge>
          <q-badge v-else>
            不明な状態({{ bot.state }})
          </q-badge>
          <q-badge
            v-if="bot.privileged"
            color="orange"
          >
            Privileged
          </q-badge>
        </div>
      </h6>
      <div class="q-gutter-md">
        <div class="row q-col-gutter-md">
          <div class="col col-md-2 col-sm-3">
            <div class="row">
              <span class="col-4 col-sm-12">
                <q-file
                  v-if="editingIcon"
                  v-model="iconFile"
                  label="2MBまでのpng,jpg,gif"
                  flat
                  style="max-width: 100%"
                  accept="image/jpeg, image/png, image/gif"
                />
                <q-img
                  v-else
                  :src="getUserIconURL(bot.botUserName)"
                /></span>
              <div class="col-5 col-md-12 col-sm-12 q-pa-md q-gutter-sm">
                <q-btn
                  v-if="editingIcon"
                  class="full-width"
                  unelevated
                  color="primary"
                  :disable="iconFile === null"
                  :loading="uploadingIcon"
                  @click="uploadIcon"
                >
                  アップロード
                </q-btn>
                <q-btn
                  class="full-width"
                  unelevated
                  color="grey"
                  @click="toggleIconEditing"
                >
                  {{ editingIcon ? 'キャンセル' : 'アイコン変更' }}
                </q-btn>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-10 col-sm-9">
            <q-tabs
              v-model="tab"
              class="text-grey"
              dense
              active-color="primary"
              indicator-color="primary"
              narrow-indicator
              align="left"
            >
              <q-tab
                name="info"
                label="基本情報"
              />
              <q-tab
                name="cred"
                label="認証情報"
              />
              <q-tab
                name="events"
                label="購読イベント"
              />
              <q-tab
                name="channels"
                label="チャンネル"
              />
              <q-tab
                name="logs"
                label="イベントログ"
              />
            </q-tabs>
            <q-separator />
            <q-tab-panels
              v-model="tab"
              animated
            >
              <q-tab-panel name="info">
                <q-form @submit="onSubmit">
                  <q-input
                    v-model="id"
                    label="BOT ID"
                    readonly
                    hint=""
                  />
                  <q-input
                    v-model="bot.botUserId"
                    label="BOT User ID"
                    readonly
                    hint=""
                  >
                    <template #after>
                      <q-icon
                        class="cursor-pointer"
                        name="file_copy"
                        @click="copyText(bot.botUserId)"
                      />
                    </template>
                  </q-input>
                  <q-input
                    v-model="displayName"
                    label="BOT表示名"
                    stack-label
                    :readonly="!editing"
                    :counter="editing"
                    maxlength="32"
                    hide-hint
                    hint="BOTが投稿したメッセージに表示されます"
                    :rules="[val => val && val.length > 0 || '必須項目です']"
                  />
                  <q-input
                    v-model="description"
                    label="説明"
                    stack-label
                    :readonly="!editing"
                    autogrow
                    type="textarea"
                    hide-hint
                    hint="使用用途等を入力してください"
                    :rules="[val => val && val.length > 0 || '必須項目です']"
                  />
                  <q-select
                    v-model="mode"
                    label="動作モード"
                    stack-label
                    :readonly="!editing"
                    hide-hint
                    hint="動作モードを選択してください"
                    :options="modeOptions"
                  />
                  <q-input
                    v-if="mode === 'HTTP'"
                    v-model="endpoint"
                    label="BOTサーバーエンドポイント"
                    stack-label
                    :readonly="!editing"
                    hide-hint
                    hint="traQのイベント送信先のURLを入力してください"
                    :rules="[val => val && urlRegex.test(val) || '有効なURLを入力してください']"
                  />
                  <div
                    v-if="editing"
                    class="row q-gutter-sm"
                  >
                    <q-btn
                      class="col btn-fixed-width"
                      label="キャンセル"
                      unelevated
                      @click="cancelEditing"
                    />
                    <q-btn
                      class="col btn-fixed-width"
                      label="送信"
                      color="primary"
                      type="submit"
                      unelevated
                    />
                  </div>
                </q-form>
                <div class="row q-gutter-sm">
                  <template v-if="!editing">
                    <q-btn
                      v-if="bot.state === 1"
                      class="col btn-fixed-width"
                      unelevated
                      color="warning"
                      @click="onDeactivateBtnClicked"
                    >
                      停止
                    </q-btn>
                    <q-btn
                      v-else
                      class="col btn-fixed-width"
                      unelevated
                      color="primary"
                      @click="onActivateBtnClicked"
                    >
                      アクティベーション
                    </q-btn>
                    <q-btn
                      class="col btn-fixed-width"
                      color="secondary"
                      unelevated
                      @click="startEditing"
                    >
                      基本情報編集
                    </q-btn>
                    <q-btn
                      class="col btn-fixed-width"
                      unelevated
                      color="negative"
                      @click="onDeleteBtnClicked"
                    >
                      削除
                    </q-btn>
                    <q-btn
                      class="col btn-fixed-width"
                      unelevated
                      color="warning"
                      @click="onTransferBtnClicked"
                    >
                      移譲
                    </q-btn>
                  </template>
                </div>
              </q-tab-panel>
              <q-tab-panel name="cred">
                <p>以下の認証情報の取り扱いに十分注意してください</p>
                <q-form>
                  <q-input
                    v-model="bot.tokens.verificationToken"
                    label="Verification Token"
                    :type="hideVerificationToken ? 'password' : 'text'"
                    readonly
                  >
                    <template #after>
                      <q-icon
                        class="cursor-pointer"
                        name="file_copy"
                        :class="{ hidden: hideVerificationToken }"
                        @click="copyText(bot.tokens.verificationToken)"
                      />
                      <q-icon
                        class="cursor-pointer"
                        :name="hideVerificationToken ? 'visibility_off' : 'visibility'"
                        @click="hideVerificationToken = !hideVerificationToken"
                      />
                    </template>
                  </q-input>
                  <q-input
                    v-model="bot.tokens.accessToken"
                    label="BOT Access Token"
                    :type="hideAccessToken ? 'password' : 'text'"
                    readonly
                  >
                    <template #after>
                      <q-icon
                        class="cursor-pointer"
                        name="file_copy"
                        :class="{ hidden: hideAccessToken }"
                        @click="copyText(bot.tokens.accessToken)"
                      />
                      <q-icon
                        class="cursor-pointer"
                        :name="hideAccessToken ? 'visibility_off' : 'visibility'"
                        @click="hideAccessToken = !hideAccessToken"
                      />
                    </template>
                  </q-input>
                  <div>
                    <q-btn
                      class="full-width"
                      color="negative"
                      unelevated
                      @click="onRevokeBtnClicked"
                    >
                      再発行
                    </q-btn>
                  </div>
                </q-form>
              </q-tab-panel>
              <q-tab-panel name="events">
                <p>可能な限り最小の設定にしてください。一部のイベントには特権が必要です。</p>
                <div
                  v-for="(evs, category) in events"
                  :key="category"
                >
                  <span class="text-caption">{{ category }}</span>
                  <div>
                    <span
                      v-for="(meta, ev) in evs"
                      :key="ev"
                    >
                      <q-checkbox
                        v-if="!meta.always"
                        v-model="checkedEvents"
                        :val="ev"
                        :label="ev"
                        :disable="meta.privileged && !bot.privileged"
                        keep-color
                        :color="meta.privileged ? 'orange': ''"
                      >
                        <q-tooltip>{{ meta.description }}</q-tooltip>
                      </q-checkbox>
                      <q-checkbox
                        v-else
                        :model-value="true"
                        :label="ev"
                        disable
                        keep-color
                      >
                        <q-tooltip>{{ meta.description }}</q-tooltip>
                      </q-checkbox></span>
                  </div>
                </div>
                <div class="q-pa-md">
                  <q-btn
                    class="full-width"
                    :disable="!subscribeEventsChanged"
                    unelevated
                    color="primary"
                    @click="onChangeEventBtnClicked"
                  >
                    変更
                  </q-btn>
                </div>
              </q-tab-panel>
              <!-- TODO fix height issue-->
              <q-tab-panel
                name="channels"
                style="min-height: 500px;"
              >
                <p>BOTが参加しているチャンネル一覧</p>
                <q-list
                  separator
                  bordered
                >
                  <q-item
                    v-for="channelId in installedChannels"
                    :key="channelId"
                  >
                    <q-item-section>
                      <q-item-label>{{ getChannel(channelId)?.channelName ?? channelId }}</q-item-label>
                      <q-item-label caption>
                        {{ channelId }}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <div class="text-grey-8 q-gutter-xs">
                        <q-btn
                          size="12px"
                          flat
                          dense
                          round
                          icon="delete"
                          @click="onRemoveBotFromChannelBtnClicked(channelId)"
                        />
                      </div>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-select
                        v-model="addingChannel"
                        dense
                        borderless
                        clearable
                        use-input
                        hide-selected
                        fill-input
                        input-debounce="0"
                        :options="channelOptions"
                        option-value="channelName"
                        option-label="channelName"
                        :loading="loadingChannels"
                        :disable="loadingChannels"
                        @filter="channelFilterFn"
                      >
                        <template #no-option>
                          <q-item>
                            <q-item-section class="text-grey">
                              チャンネルが表示されない場合は右の更新ボタンを押してください
                            </q-item-section>
                          </q-item>
                        </template>
                        <template #after>
                          <q-btn
                            round
                            dense
                            flat
                            icon="refresh"
                            @click="fetchChannels"
                          />
                          <q-btn
                            :disable="addingChannel === null"
                            round
                            dense
                            flat
                            icon="add"
                            @click="onAddBotToChannelBtnClicked(addingChannel.id)"
                          />
                        </template>
                      </q-select>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-tab-panel>
              <q-tab-panel name="logs">
                <q-table
                  :columns="eventLogsColumns"
                  :rows="eventLogs"
                  :loading="loadingEventLogs"
                  flat
                  row-key="requestId"
                  title="最近のBOTイベント"
                >
                  <template #top-right>
                    <q-btn
                      round
                      dense
                      flat
                      icon="refresh"
                      :disable="loadingEventLogs"
                      @click="fetchEventLogs"
                    />
                  </template>
                  <template #body="props">
                    <q-tr
                      class="text-right"
                      :props="props"
                    >
                      <q-td
                        key="code"
                        auto-width
                      >
                        <q-badge
                          v-if="props.row.result === 'ok'"
                          color="primary"
                        >
                          OK
                        </q-badge>
                        <q-badge
                          v-else-if="props.row.result === 'ne'"
                          color="negative"
                        >
                          NE
                        </q-badge>
                        <q-badge
                          v-else-if="props.row.result === 'ng'"
                          color="negative"
                        >
                          NG
                        </q-badge>
                        <q-badge
                          v-else-if="props.row.result === 'dp'"
                          color="warning"
                        >
                          DP
                        </q-badge>
                        <q-badge
                          v-else
                          color="warning"
                        >
                          {{ props.row.result }}
                        </q-badge>
                      </q-td>
                      <q-td
                        key="requestId"
                        auto-width
                      >
                        {{ props.row.requestId }}
                      </q-td>
                      <q-td key="event">
                        {{ props.row.event }}
                      </q-td>
                      <q-td key="datetime">
                        {{ formatDateTime(props.row.datetime, { milliseconds: true }) }}
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
                <div class="q-gutter-sm">
                  <div class="text-caption float-left">
                    <q-badge color="primary">
                      OK
                    </q-badge><span>{{ ' 正常' }}</span>
                  </div>
                  <div class="text-caption float-left">
                    <q-badge color="negative">
                      NE
                    </q-badge><span>{{ ' ネットワークエラー' }}</span>
                    <q-tooltip>traQサーバーからBOTサーバーへのリクエストに失敗しました</q-tooltip>
                  </div>
                  <div class="text-caption float-left">
                    <q-badge color="negative">
                      NG
                    </q-badge><span>{{ ' エラー' }}</span>
                    <q-tooltip>BOTサーバーのレスポンスが不正でした</q-tooltip>
                  </div>
                  <div class="text-caption float-left">
                    <q-badge color="warning">
                      DP
                    </q-badge><span>{{ ' ドロップ' }}</span>
                    <q-tooltip>(WebSocket Mode) 接続しているセッションが無かったため、イベントが送信されませんでした</q-tooltip>
                  </div>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
      </div>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { copyToClipboard, useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '../store'
import { formatDateTime } from '../utils'
import {
  traq,
  getUserIconURL,
  getUsersOptionItems
} from '../api'
import botEvents from '../botEvents'

const iconMaxFileSize = 2048 * 1024
const iconAcceptTypes = ['image/jpeg', 'image/png', 'image/gif']

const eventLogsColumns: any[] = [
  {
    name: 'code',
    label: '',
    field: 'code'
  },
  {
    name: 'requestId',
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
    field: 'datetime'
  }
]

const modeOptions = ['HTTP', 'WebSocket']
const urlRegex = /http(s)?:\/\/([\w-]+.)+[\w-]+(\/[\w- ./?%&=]*)?/i

defineOptions({ name: 'BotDetail' })

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const store = useStore()

const loading = ref(false)
const tab = ref('info')
const bot = ref<any>(null)
const installedChannels = ref<any[]>([])
const channelOptions = ref<any[]>([])
const loadingChannels = ref(false)
const addingChannel = ref<any>(null)
const iconFile = ref<any>(null)
const uploadingIcon = ref(false)
const checkedEvents = ref<any[]>([])
const editingIcon = ref(false)
const hideVerificationToken = ref(true)
const hideAccessToken = ref(true)
const eventLogs = ref<any[]>([])
const loadingEventLogs = ref(false)
const displayName = ref('')
const description = ref('')
const mode = ref('')
const endpoint = ref('')
const editing = ref(false)

const getChannelArray = computed(() => store.channelArray)
const getChannel = (channelId: string) => store.channelById(channelId)
const id = computed({
  get: () => (route.params as any).id as string,
  set: () => {}
})
const events = computed(() => {
  const categorized: Record<string, Record<string, any>> = {}
  for (const [name, meta] of Object.entries(botEvents)) {
    if (!categorized[meta.category]) {
      categorized[meta.category] = {}
    }
    categorized[meta.category]![name] = meta
  }
  return categorized
})
const subscribeEventsChanged = computed(() => {
  const arr = [...checkedEvents.value, ...(bot.value ? bot.value.subscribeEvents : [])]
  const arr2 = arr.filter((x, i, self) => self.indexOf(x) === i && i !== self.lastIndexOf(x))
  return arr.some(v => arr2.indexOf(v) === -1)
})

const fetchEventLogs = async () => {
  loadingEventLogs.value = true
  try {
    eventLogs.value = (await traq.getBotLogs(id.value)).data
  } catch (e: any) {
    console.error(e)
    $q.notify({
      icon: 'error_outline',
      color: 'red-5',
      textColor: 'white',
      message: 'イベントログ更新時にエラーが発生しました'
    })
  } finally {
    loadingEventLogs.value = false
  }
}

const fetchData = async () => {
  loading.value = true
  editing.value = false
  bot.value = null
  try {
    const botData: any = (await traq.getBot(id.value, true)).data
    const botUser = (await traq.getUser(botData.botUserId)).data
    botData.botUserName = botUser.name
    botData.displayName = botUser.displayName
    botData.developerName = await store.fetchUserName(botData.developerId)
    checkedEvents.value = [...botData.subscribeEvents]
    installedChannels.value = botData.channels
    await fetchEventLogs()
    bot.value = botData
    displayName.value = botData.displayName
    description.value = botData.description
    mode.value = botData.mode
    endpoint.value = botData.endpoint
  } catch (e: any) {
    console.error(e)
    $q.notify({
      icon: 'error_outline',
      color: 'red-5',
      textColor: 'white',
      message: '取得時にエラーが発生しました'
    })
  } finally {
    loading.value = false
  }
}

watch(() => (route.params as any).id, fetchData, { immediate: true })

const fetchChannels = async () => {
  loadingChannels.value = true
  try {
    addingChannel.value = null
    await store.updateChannelList()
  } catch (e: any) {
    console.error(e)
    $q.notify({
      icon: 'error_outline',
      color: 'red-5',
      textColor: 'white',
      message: '更新時にエラーが発生しました'
    })
  } finally {
    loadingChannels.value = false
  }
}

onMounted(() => {
  fetchChannels()
})

const channelFilterFn = (val: string, update: (callback: () => void) => void) => {
  if (val === '') {
    update(() => { channelOptions.value = getChannelArray.value })
  } else {
    update(() => {
      const l = val.toLowerCase()
      channelOptions.value = getChannelArray.value.filter(v => v.channelName.toLowerCase().includes(l))
    })
  }
}

const onSubmit = async () => {
  $q.loading.show({ delay: 400 })
  try {
    const params: Record<string, any> = {}
    if (displayName.value !== bot.value.displayName) {
      params['displayName'] = displayName.value
    }
    if (description.value !== bot.value.description) {
      params['description'] = description.value
    }
    if (mode.value !== bot.value.mode) {
      params['mode'] = mode.value
    }
    if (endpoint.value !== bot.value.endpoint) {
      params['endpoint'] = endpoint.value
    }
    await traq.editBot(id.value, params)
    await fetchData()
    $q.notify({
      icon: 'done',
      color: 'primary',
      textColor: 'white',
      message: 'BOTが編集されました'
    })
    editing.value = false
  } catch (e: any) {
    if (e.response && e.response.data.message === 'prohibited webhook host') {
      $q.notify({
        icon: 'error_outline',
        color: 'red-5',
        textColor: 'white',
        message: 'エンドポイントURLが無効です'
      })
    } else {
      console.error(e)
      $q.notify({
        icon: 'error_outline',
        color: 'red-5',
        textColor: 'white',
        message: '送信時にエラーが発生しました'
      })
    }
  } finally {
    $q.loading.hide()
  }
}

const onChangeEventBtnClicked = async () => {
  loading.value = true
  $q.loading.show({ delay: 400 })
  try {
    await traq.editBot(id.value, { subscribeEvents: checkedEvents.value })
    bot.value.subscribeEvents = checkedEvents.value
    $q.notify({
      icon: 'done',
      color: 'primary',
      textColor: 'white',
      message: '変更に成功しました'
    })
  } catch (e: any) {
    console.error(e)
    $q.notify({
      icon: 'error_outline',
      color: 'red-5',
      textColor: 'white',
      message: '変更時にエラーが発生しました'
    })
  } finally {
    loading.value = false
    $q.loading.hide()
  }
}

const onActivateBtnClicked = () => {
  $q.dialog({
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
    $q.loading.show({ delay: 400 })
    try {
      await traq.activateBot(id.value)
      $q.notify({
        icon: 'done',
        color: 'primary',
        textColor: 'white',
        message: 'アクティベーションを開始しました。疎通確認が取れた後に有効化されます。'
      })
    } catch (e: any) {
      console.error(e)
      $q.notify({
        icon: 'error_outline',
        color: 'red-5',
        textColor: 'white',
        message: 'エラーが発生しました'
      })
    } finally {
      $q.loading.hide()
    }
  })
}

const onDeactivateBtnClicked = () => {
  $q.dialog({
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
    $q.loading.show({ delay: 400 })
    try {
      await traq.inactivateBot(id.value)
      await fetchData()
    } catch (e: any) {
      console.error(e)
      $q.notify({
        icon: 'error_outline',
        color: 'red-5',
        textColor: 'white',
        message: '無効化時にエラーが発生しました'
      })
    } finally {
      $q.loading.hide()
    }
  })
}

const onDeleteBtnClicked = () => {
  $q.dialog({
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
    $q.loading.show({ delay: 400 })
    try {
      await traq.deleteBot(id.value)
      await router.push('/bots')
      $q.notify({
        icon: 'done',
        color: 'primary',
        textColor: 'white',
        message: '削除に成功しました'
      })
    } catch (e: any) {
      console.error(e)
      $q.notify({
        icon: 'error_outline',
        color: 'red-5',
        textColor: 'white',
        message: '削除時にエラーが発生しました'
      })
    } finally {
      $q.loading.hide()
    }
  })
}

const onTransferBtnClicked = async () => {
  const items = await getUsersOptionItems(bot.value.developerId)
  $q.dialog({
    title: '移譲',
    message: '誰に移譲しますか？',
    options: {
      type: 'radio',
      model: items[0]?.value as any,
      items
    } as any,
    cancel: true,
    persistent: true
  }).onOk(async user => {
    $q.dialog({
      title: '移譲',
      message: '本当に@' + user.name + 'に移譲しますか？',
      ok: {
        color: 'negative',
        unelevated: true
      },
      cancel: {
        unelevated: true
      },
      persistent: true
    }).onOk(async () => {
      $q.loading.show({ delay: 400 })
      try {
        await traq.editBot(id.value, { developerId: user.id })
        await router.push('/bots')
        $q.notify({
          icon: 'done',
          color: 'primary',
          textColor: 'white',
          message: '移譲に成功しました'
        })
      } catch (e: any) {
        console.error(e)
        $q.notify({
          icon: 'error_outline',
          color: 'red-5',
          textColor: 'white',
          message: '移譲時にエラーが発生しました'
        })
      } finally {
        $q.loading.hide()
      }
    })
  })
}

const onRevokeBtnClicked = () => {
  $q.dialog({
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
    $q.loading.show({ delay: 400 })
    try {
      await traq.reissueBot(id.value)
      await fetchData()
      $q.notify({
        icon: 'done',
        color: 'primary',
        textColor: 'white',
        message: '再発行に成功し、BOTは一時的に停止しました。'
      })
    } catch (e: any) {
      console.error(e)
      $q.notify({
        icon: 'error_outline',
        color: 'red-5',
        textColor: 'white',
        message: 'エラーが発生しました'
      })
    } finally {
      $q.loading.hide()
    }
  })
}

const onRemoveBotFromChannelBtnClicked = (channelId: string) => {
  const chName = getChannel(channelId)?.channelName ?? channelId
  $q.dialog({
    title: '確認',
    message: '本当に' + chName + 'から削除しますか？',
    ok: {
      color: 'negative',
      unelevated: true
    },
    cancel: {
      unelevated: true
    },
    persistent: true
  }).onOk(async () => {
    $q.loading.show({ delay: 400 })
    try {
      await traq.letBotLeaveChannel(id.value, { channelId })
      installedChannels.value = installedChannels.value.filter(cId => cId !== channelId)
    } catch (e: any) {
      console.error(e)
      $q.notify({
        icon: 'error_outline',
        color: 'red-5',
        textColor: 'white',
        message: '削除時にエラーが発生しました'
      })
    } finally {
      $q.loading.hide()
    }
  })
}

const onAddBotToChannelBtnClicked = (channelId: string) => {
  const chName = getChannel(channelId)?.channelName ?? channelId
  $q.dialog({
    title: '確認',
    message: '本当に' + chName + 'に追加しますか？',
    ok: {
      color: 'primary',
      unelevated: true
    },
    cancel: {
      unelevated: true
    },
    persistent: true
  }).onOk(async () => {
    $q.loading.show({ delay: 400 })
    try {
      await traq.letBotJoinChannel(id.value, { channelId })
      installedChannels.value = [...installedChannels.value, channelId]
      addingChannel.value = null
    } catch (e: any) {
      console.error(e)
      $q.notify({
        icon: 'error_outline',
        color: 'red-5',
        textColor: 'white',
        message: '追加時にエラーが発生しました'
      })
    } finally {
      $q.loading.hide()
    }
  })
}

const toggleIconEditing = () => {
  editingIcon.value = !editingIcon.value
  iconFile.value = null
}

const validateIconFile = () => {
  if (iconFile.value === null) {
    return false
  }
  if (!iconAcceptTypes.includes(iconFile.value.type)) {
    $q.notify({
      icon: 'error_outline',
      color: 'red-5',
      textColor: 'white',
      message: 'png,jpg,gifのいずれかを選択してください'
    })
    return false
  }
  if (iconFile.value.size > iconMaxFileSize) {
    $q.notify({
      icon: 'error_outline',
      color: 'red-5',
      textColor: 'white',
      message: '2MB以下のファイルを選択してください'
    })
    return false
  }
  return true
}

const onUploadIconSuccess = () => {
  editingIcon.value = false
  iconFile.value = null
  $q.notify({
    icon: 'done',
    color: 'primary',
    textColor: 'white',
    message: 'アイコンが変更されました。\nBOT Console上では、アイコン画像キャッシュの有効期限が切れた後に表示が反映されます。'
  })
}

const onUploadIconFailed = () => {
  $q.notify({
    icon: 'error_outline',
    color: 'red-5',
    textColor: 'white',
    message: 'アイコンの変更でエラーが発生しました'
  })
}

const uploadIcon = async () => {
  if (!validateIconFile()) {
    return
  }
  uploadingIcon.value = true
  try {
    await traq.changeBotIcon(id.value, iconFile.value)
    onUploadIconSuccess()
  } catch (e: any) {
    console.error(e)
    onUploadIconFailed()
  } finally {
    uploadingIcon.value = false
  }
}

const startEditing = () => {
  displayName.value = bot.value.displayName
  description.value = bot.value.description
  mode.value = bot.value.mode
  endpoint.value = bot.value.endpoint
  editing.value = true
}

const cancelEditing = () => {
  displayName.value = bot.value.displayName
  description.value = bot.value.description
  mode.value = bot.value.mode
  endpoint.value = bot.value.endpoint
  editing.value = false
}

const copyText = async (str: string) => {
  try {
    await copyToClipboard(str)
    $q.notify({
      icon: 'done',
      color: 'primary',
      textColor: 'white',
      message: 'コピーしました'
    })
  } catch (e: any) {
    console.error('copy', e)
    $q.notify({
      icon: 'error_outline',
      color: 'red-5',
      textColor: 'white',
      message: 'コピーに失敗しました'
    })
  }
}
</script>
