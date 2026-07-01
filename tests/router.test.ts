import { describe, expect, expectTypeOf, test, vi } from 'vitest'
import { router } from '../src/router'

const mocks = vi.hoisted(() => ({
  store: {
    fetchUserInfo: vi.fn(),
    updateChannelList: vi.fn(),
    setToken: vi.fn(),
  },
  fetchAuthToken: vi.fn(),
  redirectAuthorizationEndpoint: vi.fn(),
}))

vi.mock('../src/store', () => ({
  appStore: mocks.store,
}))

vi.mock('../src/api', () => ({
  fetchAuthToken: mocks.fetchAuthToken,
  redirectAuthorizationEndpoint: mocks.redirectAuthorizationEndpoint,
}))

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()

  return {
    ...actual,
    createWebHistory: actual.createMemoryHistory,
  }
})

describe('router', () => {
  test('resolves typed detail routes by name', () => {
    const route = router.resolve({ name: 'botDetail', params: { id: 'bot-id' } })

    expect(route.fullPath).toBe('/bots/bot-id')
    expect(route.params).toEqual({ id: 'bot-id' })
    expectTypeOf(route.params.id).toEqualTypeOf<string>()
  })

  test('redirects legacy list routes to dashboard', () => {
    expect(router.resolve('/bots').matched.at(-1)?.redirect).toEqual({ name: 'home' })
    expect(router.resolve('/webhooks').matched.at(-1)?.redirect).toEqual({ name: 'home' })
    expect(router.resolve('/clients').matched.at(-1)?.redirect).toEqual({ name: 'home' })
  })

  test('resolves admin dashboard route by name', () => {
    expect(router.resolve({ name: 'adminDashboard' }).fullPath).toBe('/admin')
  })
})

const assertRouteTypes = () => {
  // @ts-expect-error detail routes only accept an id param.
  router.resolve({ name: 'botDetail', params: { slug: 'bot-id' } })
}

void assertRouteTypes
