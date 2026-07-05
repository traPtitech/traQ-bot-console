import type { RouteRecordInfo } from 'vue-router'

type EmptyParams = Record<never, never>
type IdParamsRaw = { id: string | number }
type IdParams = { id: string }

export interface RouteNamedMap {
  home: RouteRecordInfo<'home', '/', EmptyParams, EmptyParams>
  adminDashboard: RouteRecordInfo<'adminDashboard', '/admin', EmptyParams, EmptyParams>
  createBot: RouteRecordInfo<'createBot', '/bots/create', EmptyParams, EmptyParams>
  botDetail: RouteRecordInfo<'botDetail', '/bots/:id', IdParamsRaw, IdParams>
  createWebhook: RouteRecordInfo<'createWebhook', '/webhooks/create', EmptyParams, EmptyParams>
  testWebhook: RouteRecordInfo<'testWebhook', '/webhooks/tester', EmptyParams, EmptyParams>
  webhookDetail: RouteRecordInfo<'webhookDetail', '/webhooks/:id', IdParamsRaw, IdParams>
  createClient: RouteRecordInfo<'createClient', '/clients/create', EmptyParams, EmptyParams>
  clientDetail: RouteRecordInfo<'clientDetail', '/clients/:id', IdParamsRaw, IdParams>
  callback: RouteRecordInfo<'callback', '/callback', EmptyParams, EmptyParams>
}

declare module 'vue-router' {
  interface TypesConfig {
    RouteNamedMap: RouteNamedMap
  }
}
