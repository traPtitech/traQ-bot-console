import { describe, expect, test } from 'vitest'
import { BotMode, BotState, OAuth2Scope } from '@traptitech/traq'
import {
  filterDashboardItems,
  getBotSearchFields,
  getClientSearchFields,
  getWebhookSearchFields,
  matchesDashboardSearch,
  normalizeDashboardSearchQuery,
} from '../src/components/dashboard-search'

describe('dashboard search', () => {
  test('normalizes query by trimming and lowercasing', () => {
    expect(normalizeDashboardSearchQuery('  WebHook  ')).toBe('webhook')
  })

  test('matches all items with an empty query', () => {
    expect(matchesDashboardSearch('', ['Webhook', undefined])).toBe(true)
    expect(matchesDashboardSearch('   ', [])).toBe(true)
  })

  test('matches fields case-insensitively by partial match', () => {
    expect(matchesDashboardSearch('bot', ['BOT_foo'])).toBe(true)
    expect(matchesDashboardSearch('hook', ['Webhook sender'])).toBe(true)
  })

  test('does not match unrelated fields', () => {
    expect(matchesDashboardSearch('client', ['Webhook sender', 'BOT_foo'])).toBe(false)
  })

  test('filters by fields extracted from items', () => {
    const items = [
      {
        name: 'Release notifier',
        description: 'Posts deployment messages',
        ownerName: 'alice',
        scopeLabels: ['チャンネル投稿'],
      },
      {
        name: 'Analytics client',
        description: 'Reads usage stats',
        ownerName: 'bob',
        scopeLabels: ['BOT管理'],
      },
    ]

    expect(
      filterDashboardItems(items, 'deploy', (item) => [
        item.name,
        item.description,
        item.ownerName,
        ...item.scopeLabels,
      ]),
    ).toEqual([items[0]])

    expect(
      filterDashboardItems(items, 'BOT', (item) => [
        item.name,
        item.description,
        item.ownerName,
        ...item.scopeLabels,
      ]),
    ).toEqual([items[1]])
  })

  test('uses webhook display fields for search', () => {
    const webhook = {
      id: 'webhook-id',
      botUserId: 'bot-user-id',
      botUserName: 'WebhookBot',
      channelId: 'channel-id',
      createdAt: '2026-01-01T00:00:00.000Z',
      description: 'posts releases',
      displayName: 'Release webhook',
      ownerId: 'owner-id',
      ownerName: 'alice',
      secure: true,
      updatedAt: '2026-01-01T00:00:00.000Z',
    }

    expect(matchesDashboardSearch('release', getWebhookSearchFields(webhook))).toBe(true)
    expect(matchesDashboardSearch('posts', getWebhookSearchFields(webhook))).toBe(true)
    expect(matchesDashboardSearch('webhookbot', getWebhookSearchFields(webhook))).toBe(true)
    expect(matchesDashboardSearch('alice', getWebhookSearchFields(webhook))).toBe(true)
    expect(matchesDashboardSearch('channel-id', getWebhookSearchFields(webhook))).toBe(false)
  })

  test('uses bot display fields for search', () => {
    const bot = {
      id: 'bot-id',
      botUserId: 'bot-user-id',
      botUserName: 'BOT_release',
      createdAt: '2026-01-01T00:00:00.000Z',
      description: 'deployment notifier',
      developerId: 'developer-id',
      developerName: 'bob',
      displayName: 'Release BOT',
      mode: BotMode.HTTP,
      privileged: false,
      state: BotState.active,
      subscribeEvents: [],
      updatedAt: '2026-01-01T00:00:00.000Z',
    }

    expect(matchesDashboardSearch('release', getBotSearchFields(bot))).toBe(true)
    expect(matchesDashboardSearch('deployment', getBotSearchFields(bot))).toBe(true)
    expect(matchesDashboardSearch('bob', getBotSearchFields(bot))).toBe(true)
    expect(matchesDashboardSearch('developer-id', getBotSearchFields(bot))).toBe(false)
  })

  test('uses client display fields for search', () => {
    const client = {
      id: 'client-id',
      callbackUrl: 'https://example.com/callback',
      confidential: true,
      description: 'client for release automation',
      developerId: 'developer-id',
      developerName: 'carol',
      name: 'Release client',
      scopes: [OAuth2Scope.Write],
      scopeLabels: ['チャンネル投稿'],
    }

    expect(matchesDashboardSearch('release', getClientSearchFields(client))).toBe(true)
    expect(matchesDashboardSearch('automation', getClientSearchFields(client))).toBe(true)
    expect(matchesDashboardSearch('チャンネル', getClientSearchFields(client))).toBe(true)
    expect(matchesDashboardSearch('carol', getClientSearchFields(client))).toBe(true)
    expect(matchesDashboardSearch('callback', getClientSearchFields(client))).toBe(false)
  })

  test('filters dashboard resources by their configured fields', () => {
    const webhooks = [
      {
        id: 'release-webhook-id',
        botUserId: 'bot-user-id',
        botUserName: 'ReleaseBot',
        channelId: 'channel-id',
        createdAt: '2026-01-01T00:00:00.000Z',
        description: 'posts releases',
        displayName: 'Release webhook',
        ownerId: 'owner-id',
        ownerName: 'alice',
        secure: true,
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'incident-webhook-id',
        botUserId: 'bot-user-id',
        botUserName: 'IncidentBot',
        channelId: 'channel-id',
        createdAt: '2026-01-01T00:00:00.000Z',
        description: 'posts incidents',
        displayName: 'Incident webhook',
        ownerId: 'owner-id',
        secure: false,
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    ]
    const bots = [
      {
        id: 'release-bot-id',
        botUserId: 'bot-user-id',
        botUserName: 'BOT_release',
        createdAt: '2026-01-01T00:00:00.000Z',
        description: 'deployment notifier',
        developerId: 'developer-id',
        displayName: 'Release BOT',
        mode: BotMode.HTTP,
        privileged: false,
        state: BotState.active,
        subscribeEvents: [],
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'alert-bot-id',
        botUserId: 'bot-user-id',
        botUserName: 'BOT_alert',
        createdAt: '2026-01-01T00:00:00.000Z',
        description: 'alerts maintainers',
        developerId: 'developer-id',
        developerName: 'bob',
        displayName: 'Alert BOT',
        mode: BotMode.HTTP,
        privileged: false,
        state: BotState.active,
        subscribeEvents: [],
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    ]
    const clients = [
      {
        id: 'release-client-id',
        callbackUrl: 'https://example.com/callback',
        confidential: true,
        description: 'client for release automation',
        developerId: 'developer-id',
        name: 'Release client',
        scopes: [OAuth2Scope.Write],
        scopeLabels: ['チャンネル投稿'],
      },
      {
        id: 'analytics-client-id',
        callbackUrl: 'https://example.com/callback',
        confidential: true,
        description: 'reads usage stats',
        developerId: 'developer-id',
        developerName: 'carol',
        name: 'Analytics client',
        scopes: [OAuth2Scope.Read],
        scopeLabels: ['読み取り'],
      },
    ]

    expect(filterDashboardItems(webhooks, 'incident', getWebhookSearchFields)).toEqual([
      webhooks[1],
    ])
    expect(filterDashboardItems(bots, 'maintainers', getBotSearchFields)).toEqual([bots[1]])
    expect(filterDashboardItems(clients, '読み', getClientSearchFields)).toEqual([clients[1]])
    expect(filterDashboardItems(clients, 'missing', getClientSearchFields)).toEqual([])
  })
})
