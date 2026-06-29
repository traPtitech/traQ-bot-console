import { createPinia, defineStore } from 'pinia'
import type { MyUserDetail } from '@traptitech/traq'
import { traq, setAuthToken } from '../api'
import { parseAPIChannelList } from '../utils'
import type { ParsedChannel } from '../utils'

interface PersistedState {
  authToken: string | null
  usernames: Record<string, string>
  channelList: ParsedChannel[]
}

interface State extends PersistedState {
  userInfo: MyUserDetail | null
}

// Keep the previous vuex-persistedstate key so existing sessions stay signed in.
const persistedStateKey = 'vuex'

function getLocalStorage (): Storage | null {
  return typeof window === 'undefined' ? null : window.localStorage
}

function readPersistedState (): PersistedState {
  const storage = getLocalStorage()
  if (storage === null) {
    return {
      authToken: null,
      usernames: {},
      channelList: []
    }
  }

  try {
    const raw = storage.getItem(persistedStateKey)
    if (!raw) {
      return {
        authToken: null,
        usernames: {},
        channelList: []
      }
    }

    const parsed = JSON.parse(raw) as Partial<PersistedState>
    return {
      authToken: parsed.authToken ?? null,
      usernames: parsed.usernames ?? {},
      channelList: parsed.channelList ?? []
    }
  } catch (e) {
    console.error(e)
    return {
      authToken: null,
      usernames: {},
      channelList: []
    }
  }
}

function writePersistedState ({ authToken, usernames, channelList }: State): void {
  const storage = getLocalStorage()
  if (storage === null) return

  storage.setItem(persistedStateKey, JSON.stringify({
    authToken,
    usernames,
    channelList
  }))
}

const persistedState = readPersistedState()

export const store = createPinia()

export const useStore = defineStore('app', {
  state: (): State => ({
    userInfo: null,
    authToken: persistedState.authToken,
    usernames: persistedState.usernames,
    channelList: persistedState.channelList
  }),
  getters: {
    channelArray: state => state.channelList.filter(c => !c.archived),
    channelById: state => (id: string) => state.channelList.find(c => c.id === id)
  },
  actions: {
    setUserInfo (info: MyUserDetail) {
      this.userInfo = info
    },
    setToken (token: string | null) {
      this.authToken = token
      setAuthToken(token)
    },
    addUserNameCache ({ id, name }: { id: string, name: string }) {
      this.usernames[id] = name
    },
    putChannelList (list: ParsedChannel[]) {
      this.channelList = list
    },
    async fetchUserInfo () {
      const res = await traq.getMe()
      this.setUserInfo(res.data)
    },
    async fetchUserName (id: string): Promise<string> {
      let name = this.usernames[id]
      if (name) return name

      try {
        const res = await traq.getUser(id)
        name = res.data.name
      } catch (e) {
        console.error(e)
        return 'エラー'
      }
      this.addUserNameCache({ id, name })
      return name
    },
    async updateChannelList () {
      const res = await traq.getChannels()
      const list = parseAPIChannelList(res.data.public)
      this.putChannelList(list)
    }
  }
})

export const appStore = useStore(store)

setAuthToken(appStore.authToken)
appStore.$subscribe((_, state) => {
  writePersistedState(state)
})
