import type { RouteLocationNormalized } from 'vue-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { handleOAuthCallback, requireAuthentication } from '../src/router/guards'

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

function routeWithQuery(query: RouteLocationNormalized['query']): RouteLocationNormalized {
  return { query } as RouteLocationNormalized
}

function installSessionStorage(entries: Record<string, string> = {}): void {
  const storage = new Map(Object.entries(entries))

  vi.stubGlobal('sessionStorage', {
    getItem: vi.fn((key: string) => storage.get(key) ?? null),
  })
}

describe('router guards', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllGlobals()
    installSessionStorage()
  })

  it('allows authenticated routes after fetching current state', async () => {
    await expect(requireAuthentication()).resolves.toBeUndefined()

    expect(mocks.store.fetchUserInfo).toHaveBeenCalledWith()
    expect(mocks.store.updateChannelList).toHaveBeenCalledWith()
    expect(mocks.redirectAuthorizationEndpoint).not.toHaveBeenCalled()
  })

  it('redirects to authorization when current state fetching fails', async () => {
    mocks.store.fetchUserInfo.mockRejectedValue({ response: { status: 401 } })

    await expect(requireAuthentication()).resolves.toBe(false)

    expect(mocks.store.updateChannelList).not.toHaveBeenCalled()
    expect(mocks.redirectAuthorizationEndpoint).toHaveBeenCalledWith()
  })

  it('throws non-authentication errors from current state fetching', async () => {
    const error = { response: { status: 500 } }
    mocks.store.fetchUserInfo.mockRejectedValue(error)

    await expect(requireAuthentication()).rejects.toBe(error)

    expect(mocks.store.updateChannelList).not.toHaveBeenCalled()
    expect(mocks.redirectAuthorizationEndpoint).not.toHaveBeenCalled()
  })

  it('redirects callback navigation home when code is missing', async () => {
    installSessionStorage({ 'login-code-verifier-state-1': 'verifier-1' })

    await expect(handleOAuthCallback(routeWithQuery({ state: 'state-1' }))).resolves.toEqual({
      name: 'home',
    })

    expect(mocks.fetchAuthToken).not.toHaveBeenCalled()
    expect(mocks.store.setToken).not.toHaveBeenCalled()
  })

  it('redirects callback navigation home when verifier is missing', async () => {
    await expect(
      handleOAuthCallback(routeWithQuery({ code: 'code-1', state: 'state-1' })),
    ).resolves.toEqual({ name: 'home' })

    expect(sessionStorage.getItem).toHaveBeenCalledWith('login-code-verifier-state-1')
    expect(mocks.fetchAuthToken).not.toHaveBeenCalled()
    expect(mocks.store.setToken).not.toHaveBeenCalled()
  })

  it('stores the fetched token and redirects callback navigation home', async () => {
    installSessionStorage({ 'login-code-verifier-state-1': 'verifier-1' })
    mocks.fetchAuthToken.mockResolvedValue({ data: { access_token: 'token-1' } })

    await expect(
      handleOAuthCallback(routeWithQuery({ code: 'code-1', state: 'state-1' })),
    ).resolves.toEqual({ name: 'home' })

    expect(mocks.fetchAuthToken).toHaveBeenCalledWith('code-1', 'verifier-1')
    expect(mocks.store.setToken).toHaveBeenCalledWith('token-1')
  })

  it('cancels callback navigation when token fetching fails', async () => {
    installSessionStorage({ 'login-code-verifier-state-1': 'verifier-1' })
    mocks.fetchAuthToken.mockRejectedValue(new Error('network'))
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    await expect(
      handleOAuthCallback(routeWithQuery({ code: 'code-1', state: 'state-1' })),
    ).resolves.toBe(false)

    expect(consoleError).toHaveBeenCalled()
    expect(mocks.store.setToken).not.toHaveBeenCalled()
  })
})
