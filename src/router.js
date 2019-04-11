import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import { fetchAuthToken, redirectAuthorizationEndpoint, setAuthToken } from './api'

Vue.use(Router)

setAuthToken(store.state.authToken)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: () => import('./layouts/Default'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('./views/Home')
        },
        {
          path: 'docs/',
          name: 'docs',
          component: () => import('./layouts/Docs'),
          children: [
            {
              path: '',
              component: () => import('./docs/index.md')
            },
            {
              path: 'webhook',
              component: () => import('./docs/webhook/webhook.md')
            },
            {
              path: 'webhook/hmacsha1',
              component: () => import('./docs/webhook/hmacsha1.md')
            },
            {
              path: 'webhook/rule',
              component: () => import('./docs/webhook/rule.md')
            },
            {
              path: 'webhook/create',
              component: () => import('./docs/webhook/create.md')
            },
            {
              path: 'webhook/send',
              component: () => import('./docs/webhook/send.md')
            },
            {
              path: 'bot/bot',
              component: () => import('./docs/bot/bot.md')
            },
            {
              path: 'bot/rule',
              component: () => import('./docs/bot/rule.md')
            }
          ]
        },
        {
          path: 'bots',
          name: 'bots',
          component: () => import('./views/Bots')
        },
        {
          path: 'bots/create',
          name: 'createBot',
          component: () => import('./views/CreateBot')
        },
        {
          path: 'webhooks',
          name: 'webhooks',
          component: () => import('./views/Webhooks')
        },
        {
          path: 'webhooks/create',
          name: 'createWebhook',
          component: () => import('./views/CreateWebhook')
        },
        {
          path: 'webhooks/tester',
          name: 'testWebhook',
          component: () => import('./views/WebhookTester')
        },
        {
          path: 'webhooks/:id',
          name: 'webhookDetail',
          component: () => import('./views/WebhookDetail')
        }
      ],
      beforeEnter: async (to, from, next) => {
        try {
          await store.dispatch('fetchUserInfo')
          await store.dispatch('updateChannelList')
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
