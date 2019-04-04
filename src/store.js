import Vue from 'vue'
import Vuex from 'vuex'
import { setAuthToken, getUser, getChannels } from './api'
import { parseAPIChannelList } from './utils'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authToken: null,
    usernames: {},
    channelList: []
  },
  getters: {
    getChannelArray: state => state.channelList.filter(c => c.visibility && !c.private)
  },
  mutations: {
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
    async fetchUserName ({ state, commit }, id) {
      let name = state.usernames[id]
      if (name) return name

      try {
        const res = await getUser(id)
        name = res.data.name
      } catch (e) {
        console.error(e)
        return 'エラー'
      }
      commit('addUserNameCache', { id, name })
      return name
    },
    async updateChannelList ({ commit }) {
      const res = await getChannels()
      const list = parseAPIChannelList(res.data)
      commit('putChannelList', list)
    }
  },
  plugins: [createPersistedState({
    paths: ['authToken', 'usernames', 'channelList']
  })]
})
