import { createStore } from 'vuex'
import type { ActionContext } from 'vuex'
import type { MyUserDetail } from '@traptitech/traq'
import { traq, setAuthToken } from '../api'
import { parseAPIChannelList } from '../utils'
import type { ParsedChannel } from '../utils'
import createPersistedState from 'vuex-persistedstate'

interface State {
  userInfo: MyUserDetail | null
  authToken: string | null
  usernames: Record<string, string>
  channelList: ParsedChannel[]
}

type StoreContext = ActionContext<State, State>

export const store = createStore({
  state: (): State => ({
    userInfo: null,
    authToken: null,
    usernames: {},
    channelList: []
  }),
  getters: {
    getChannelArray: state => state.channelList.filter(c => !c.archived),
    getChannel: state => (id: string) => state.channelList.find(c => c.id === id)
  },
  mutations: {
    setUserInfo (state: State, info: MyUserDetail) {
      state.userInfo = info
    },
    setToken (state: State, token: string | null) {
      state.authToken = token
      setAuthToken(token)
    },
    addUserNameCache (state: State, { id, name }: { id: string, name: string }) {
      state.usernames[id] = name
    },
    putChannelList (state: State, list: ParsedChannel[]) {
      state.channelList = list
    }
  },
  actions: {
    async fetchUserInfo ({ commit }: StoreContext) {
      const res = await traq.getMe()
      commit('setUserInfo', res.data)
    },
    async fetchUserName ({ state, commit }: StoreContext, id: string): Promise<string> {
      let name = state.usernames[id]
      if (name) return name

      try {
        const res = await traq.getUser(id)
        name = res.data.name
      } catch (e) {
        console.error(e)
        return 'エラー'
      }
      commit('addUserNameCache', { id, name })
      return name
    },
    async updateChannelList ({ commit }: StoreContext) {
      const res = await traq.getChannels()
      const list = parseAPIChannelList(res.data.public)
      commit('putChannelList', list)
    }
  },
  plugins: [createPersistedState({
    paths: ['authToken', 'usernames', 'channelList']
  })]
})
