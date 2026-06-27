import { beforeEach, describe, expect, it, vi } from 'vitest'

type TraqInstanceMock = {
  options: unknown
  postOAuth2Token: ReturnType<typeof vi.fn>
  postWebhook: ReturnType<typeof vi.fn>
  getUsers: ReturnType<typeof vi.fn>
}

const mocks = vi.hoisted((): {
  traqInstances: TraqInstanceMock[]
  randomString: ReturnType<typeof vi.fn>
  pkce: ReturnType<typeof vi.fn>
  hmacsha1: ReturnType<typeof vi.fn>
} => ({
  traqInstances: [],
  randomString: vi.fn(),
  pkce: vi.fn(),
  hmacsha1: vi.fn()
}))

vi.mock('@traptitech/traq', () => ({
  Apis: class MockTraQ {
    options: unknown
    postOAuth2Token = vi.fn()
    postWebhook = vi.fn()
    getUsers = vi.fn()

    constructor (options: unknown) {
      this.options = options
      mocks.traqInstances.push(this)
    }
  }
}))

vi.mock('../src/utils', () => ({
  randomString: mocks.randomString,
  pkce: mocks.pkce,
  hmacsha1: mocks.hmacsha1
}))

function installBrowserGlobals (): void {
  const storage = new Map<string, string>()

  vi.stubGlobal('window', {
    location: {
      assign: vi.fn()
    }
  })
  vi.stubGlobal('sessionStorage', {
    getItem: vi.fn(key => storage.get(key) ?? null),
    setItem: vi.fn((key, value) => storage.set(key, value))
  })
}

describe('api', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    mocks.traqInstances.length = 0
    installBrowserGlobals()
  })

  it('uses the default traQ API endpoint and encodes user icon names', async () => {
    const api = await import('../src/api')

    expect(api.baseURL).toBe('https://q-dev.trapti.tech/api/v3')
    expect(mocks.traqInstances[0].options).toEqual({
      basePath: 'https://q-dev.trapti.tech/api/v3'
    })
    expect(api.getUserIconURL('BOT_こんにちは/space user')).toBe(
      'https://q-dev.trapti.tech/api/v3/public/icon/BOT_%E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF%2Fspace%20user'
    )
  })

  it('recreates the traQ client with an access token', async () => {
    const api = await import('../src/api')

    api.setAuthToken('token-1')

    expect(api.traq).toBe(mocks.traqInstances[1])
    expect(mocks.traqInstances[1].options).toEqual({
      basePath: 'https://q-dev.trapti.tech/api/v3',
      accessToken: 'token-1'
    })
  })

  it('builds the OAuth authorization URL and stores the PKCE verifier by state', async () => {
    mocks.randomString
      .mockReturnValueOnce('state-1234')
      .mockReturnValueOnce('verifier-abcdefghijklmnopqrstuvwxyz0123456789abcdefg')
    mocks.pkce.mockResolvedValue('challenge-value')
    const api = await import('../src/api')

    await api.redirectAuthorizationEndpoint()

    expect(sessionStorage.setItem).toHaveBeenCalledWith(
      'login-code-verifier-state-1234',
      'verifier-abcdefghijklmnopqrstuvwxyz0123456789abcdefg'
    )
    const assign = window.location.assign as unknown as ReturnType<typeof vi.fn>
    const assigned = new URL(String(assign.mock.calls[0][0]))
    expect(assigned.href).toBe('https://q-dev.trapti.tech/api/v3/oauth2/authorize?client_id=lkElAHAUIqFmImUvxmWItnbWO7EBdxttwBaW&response_type=code&code_challenge=challenge-value&code_challenge_method=S256&state=state-1234')
  })

  it('posts OAuth token requests through the current traQ client', async () => {
    const api = await import('../src/api')
    mocks.traqInstances[0].postOAuth2Token.mockResolvedValue({ data: { access_token: 'token' } })

    await expect(api.fetchAuthToken('code-1', 'verifier-1')).resolves.toEqual({
      data: { access_token: 'token' }
    })
    expect(mocks.traqInstances[0].postOAuth2Token).toHaveBeenCalledWith(
      'authorization_code',
      'code-1',
      undefined,
      'lkElAHAUIqFmImUvxmWItnbWO7EBdxttwBaW',
      'verifier-1'
    )
  })

  it('posts webhook messages without a signature when no secret is given', async () => {
    const api = await import('../src/api')
    mocks.traqInstances[0].postWebhook.mockResolvedValue({ ok: true })

    await api.postWebhookMessage('webhook-id', 'message body')

    expect(mocks.hmacsha1).not.toHaveBeenCalled()
    expect(mocks.traqInstances[0].postWebhook).toHaveBeenCalledWith(
      'webhook-id',
      undefined,
      undefined,
      undefined,
      'message body'
    )
  })

  it('posts webhook messages with an HMAC-SHA1 signature when a secret is given', async () => {
    mocks.hmacsha1.mockResolvedValue('signature-hex')
    const api = await import('../src/api')

    await api.postWebhookMessage('webhook-id', 'message body', 'secret')

    expect(mocks.hmacsha1).toHaveBeenCalledWith('message body', 'secret')
    expect(mocks.traqInstances[0].postWebhook).toHaveBeenCalledWith(
      'webhook-id',
      'signature-hex',
      undefined,
      undefined,
      'message body'
    )
  })

  it('returns selectable users excluding owner, webhook users, and bot users', async () => {
    const api = await import('../src/api')
    mocks.traqInstances[0].getUsers.mockResolvedValue({
      data: [
        { id: 'owner', name: 'owner' },
        { id: 'webhook', name: 'Webhook#general' },
        { id: 'bot', name: 'BOT_helper' },
        { id: 'z', name: 'zeta' },
        { id: 'a', name: 'Alpha' },
        { id: 'b', name: 'beta' }
      ]
    })

    await expect(api.getUsersOptionItems('owner')).resolves.toEqual([
      { label: '@Alpha', value: { id: 'a', name: 'Alpha' } },
      { label: '@beta', value: { id: 'b', name: 'beta' } },
      { label: '@zeta', value: { id: 'z', name: 'zeta' } }
    ])
  })
})
