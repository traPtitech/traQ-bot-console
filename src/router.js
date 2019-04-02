import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import { fetchAuthToken, redirectAuthorizationEndpoint, getMe, setAuthToken } from './api'
import DefaultLayout from './layouts/Default.vue'

Vue.use(Router)

setAuthToken(store.state.authToken)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('./views/Home')
        },
        {
          path: 'account',
          name: 'account',
          component: () => import('./views/Account')
        },
        {
          path: 'bots',
          name: 'bots',
          component: () => import('./views/Bots')
        },
        {
          path: 'webhooks',
          name: 'webhooks',
          component: () => import('./views/Webhooks')
        }
      ],
      beforeEnter: async (to, from, next) => {
        try {
          await getMe()
          next()
        } catch (e) {
          await redirectAuthorizationEndpoint()
        }
      }
    },
    {
      path: '/callback',
      name: 'callback',
      component: () => import('./views/Callback'),
      beforeEnter: async (to, from, next) => {
        const code = to.query.code
        const state = to.query.state
        const codeVerifier = sessionStorage.getItem(`login-code-verifier-${state}`)
        if (!code || !codeVerifier) {
          next('/')
        }

        try {
          const res = await fetchAuthToken(code, codeVerifier)
          store.commit('setToken', res.data.access_token)
          next('/')
        } catch (e) {
          console.error(e)
        }
      }
    }
  ]
})
