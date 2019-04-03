import Vue from 'vue'
import Vuex from 'vuex'
import { setAuthToken, getUser } from './api'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authToken: null,
    usernames: {}
  },
  mutations: {
    setToken (state, token) {
      state.authToken = token
      setAuthToken(token)
    },
    addUserNameCache (state, { id, name }) {
      state.usernames[id] = name
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
    }
  },
  plugins: [createPersistedState({
    paths: ['authToken', 'usernames']
  })]
})
