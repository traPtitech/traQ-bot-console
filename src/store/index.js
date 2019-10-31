import Vue from 'vue'
import Vuex from 'vuex'
import { setAuthToken, getUser, getChannels, getMe } from '../api'
import { parseAPIChannelList } from '../utils'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: null,
    authToken: null,
    usernames: {},
    channelList: []
  },
  getters: {
    getChannelArray: state => state.channelList.filter(c => c.visibility && !c.private),
    getChannel: state => id => {
      for (let channel of state.channelList) {
        if (channel.channelId === id) {
          return channel
        }
      }
      return null
    }
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
      const res = await getMe()
      commit('setUserInfo', res.data)
    },
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
