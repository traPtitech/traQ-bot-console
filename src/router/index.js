import { createRouter, createWebHistory } from 'vue-router'
import { store } from '../store'
import { fetchAuthToken, redirectAuthorizationEndpoint, setAuthToken } from '../api'

setAuthToken(store.state.authToken)

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/Default.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/Home.vue')
        },
        {
          path: 'docs/',
          component: () => import('../layouts/Docs.vue'),
          children: [
            {
              path: '',
              component: () => import('../docs/index.md').then(r => r.VueComponent)
            },
            {
              path: 'webhook',
              component: () => import('../docs/webhook/webhook.md').then(r => r.VueComponent)
            },
            {
              path: 'webhook/hmacsha1',
              component: () => import('../docs/webhook/hmacsha1.md').then(r => r.VueComponent)
            },
            {
              path: 'webhook/rule',
              component: () => import('../docs/webhook/rule.md').then(r => r.VueComponent)
            },
            {
              path: 'webhook/create',
              component: () => import('../docs/webhook/create.md').then(r => r.VueComponent)
            },
            {
              path: 'webhook/send',
              component: () => import('../docs/webhook/send.md').then(r => r.VueComponent)
            },
            {
              path: 'bot',
              component: () => import('../docs/bot/bot.md').then(r => r.VueComponent)
            },
            {
              path: 'bot/rule',
              component: () => import('../docs/bot/rule.md').then(r => r.VueComponent)
            },
            {
              path: 'bot/overview',
              component: () => import('../docs/bot/overview.md').then(r => r.VueComponent)
            },
            {
              path: 'bot/register',
              component: () => import('../docs/bot/register.md').then(r => r.VueComponent)
            },
            {
              path: 'bot/settings',
              component: () => import('../docs/bot/settings.md').then(r => r.VueComponent)
            },
            {
              path: 'bot/http-server',
              component: () => import('../docs/bot/http-server.md').then(r => r.VueComponent)
            },
            {
              path: 'bot/ws-server',
              component: () => import('../docs/bot/ws-server.md').then(r => r.VueComponent)
            },
            {
              path: 'bot/events',
              component: () => import('../docs/bot/events/index.md').then(r => r.VueComponent)
            },
            {
              path: 'bot/events/system',
              component: () => import('../docs/bot/events/system.md').then(r => r.VueComponent)
            },
            {
              path: 'bot/events/message',
              component: () => import('../docs/bot/events/message.md').then(r => r.VueComponent)
            },
            {
              path: 'bot/events/channel',
              component: () => import('../docs/bot/events/channel.md').then(r => r.VueComponent)
            },
            {
              path: 'bot/events/user',
              component: () => import('../docs/bot/events/user.md').then(r => r.VueComponent)
            },
            {
              path: 'bot/events/user-group',
              component: () => import('../docs/bot/events/user-group.md').then(r => r.VueComponent)
            },
            {
              path: 'bot/events/stamp',
              component: () => import('../docs/bot/events/stamp.md').then(r => r.VueComponent)
            },
            {
              path: 'bot/events/tag',
              component: () => import('../docs/bot/events/tag.md').then(r => r.VueComponent)
            },
            {
              path: 'bot/traq-api',
              component: () => import('../docs/bot/traq-api.md').then(r => r.VueComponent)
            },
            {
              path: 'client',
              component: () => import('../docs/client/client.md').then(r => r.VueComponent)
            },
            {
              path: 'client/rule',
              component: () => import('../docs/client/rule.md').then(r => r.VueComponent)
            },
            {
              path: 'client/overview',
              component: () => import('../docs/client/overview.md').then(r => r.VueComponent)
            },
            {
              path: 'client/create',
              component: () => import('../docs/client/create.md').then(r => r.VueComponent)
            },
            {
              path: 'client/page',
              component: () => import('../docs/client/page.md').then(r => r.VueComponent)
            }
          ]
        },
        {
          path: 'bots',
          name: 'bots',
          component: () => import('../views/Bots.vue')
        },
        {
          path: 'bots/create',
          name: 'createBot',
          component: () => import('../views/CreateBot.vue')
        },
        {
          path: 'bots/:id',
          name: 'botDetail',
          component: () => import('../views/BotDetail.vue')
        },
        {
          path: 'webhooks',
          name: 'webhooks',
          component: () => import('../views/Webhooks.vue')
        },
        {
          path: 'webhooks/create',
          name: 'createWebhook',
          component: () => import('../views/CreateWebhook.vue')
        },
        {
          path: 'webhooks/tester',
          name: 'testWebhook',
          component: () => import('../views/WebhookTester.vue')
        },
        {
          path: 'webhooks/:id',
          name: 'webhookDetail',
          component: () => import('../views/WebhookDetail.vue')
        },
        {
          path: 'clients',
          name: 'clients',
          component: () => import('../views/Clients.vue')
        },
        {
          path: 'clients/create',
          name: 'createClient',
          component: () => import('../views/CreateClient.vue')
        },
        {
          path: 'clients/:id',
          name: 'clientDetail',
          component: () => import('../views/ClientDetail.vue')
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
      component: () => import('../views/Callback.vue'),
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
