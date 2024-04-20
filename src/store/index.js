import { createStore } from 'vuex'
import { traq, setAuthToken } from '../api'
import { parseAPIChannelList } from '../utils'
import createPersistedState from 'vuex-persistedstate'

export const store = createStore({
  state: {
    userInfo: null,
    authToken: null,
    usernames: {},
    channelList: []
  },
  getters: {
    getChannelArray: state => state.channelList.filter(c => !c.archived),
    getChannel: state => id => state.channelList.find(c => c.id === id)
  },
  mutations: {
    setUserInfo (state, info) {
      state.userInfo = info
    },
    setToken (state, token) {
      state.authToken = token
      setAuthToken(token)
    },
    addUserNameCache (state, { id, name }) {
      state.usernames[id] = name
    },
    putChannelList (state, list) {
      state.channelList = list
    }
  },
  actions: {
    async fetchUserInfo ({ commit }) {
      const res = await traq.getMe()
      commit('setUserInfo', res.data)
    },
    async fetchUserName ({ state, commit }, id) {
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
    async updateChannelList ({ commit }) {
      const res = await traq.getChannels()
      const list = parseAPIChannelList(res.data.public)
      commit('putChannelList', list)
    }
  },
  plugins: [createPersistedState({
    paths: ['authToken', 'usernames', 'channelList']
  })]
})
