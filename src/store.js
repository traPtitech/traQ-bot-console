import Vue from 'vue'
import Vuex from 'vuex'
import { setAuthToken } from './api'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authToken: null
  },
  mutations: {
    setToken (state, token) {
      state.authToken = token
      setAuthToken(token)
    }
  },
  actions: {},
  plugins: [createPersistedState({
    paths: ['authToken']
  })]
})
