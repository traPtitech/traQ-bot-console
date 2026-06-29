import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

const mocks = vi.hoisted(() => ({
  setAuthToken: vi.fn(),
  parseAPIChannelList: vi.fn(),
  traq: {
    getMe: vi.fn(),
    getUser: vi.fn(),
    getChannels: vi.fn()
  }
}))

vi.mock('../src/api', () => ({
  traq: mocks.traq,
  setAuthToken: mocks.setAuthToken
}))

vi.mock('../src/utils', () => ({
  parseAPIChannelList: mocks.parseAPIChannelList
}))

function stubLocalStorage (initial: Record<string, string> = {}) {
  const storage = new Map(Object.entries(initial))
  const localStorage = {
    getItem: vi.fn((key: string) => storage.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      storage.set(key, value)
    }),
    removeItem: vi.fn((key: string) => {
      storage.delete(key)
    })
  }
  vi.stubGlobal('localStorage', localStorage)
  vi.stubGlobal('window', { localStorage })
  return localStorage
}

async function loadStore () {
  vi.resetModules()
  return (await import('../src/store')).appStore
}

describe('store', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
    mocks.traq.getMe.mockReset()
    mocks.traq.getUser.mockReset()
    mocks.traq.getChannels.mockReset()
    mocks.parseAPIChannelList.mockReset()
  })

  it('initializes with empty auth, username, and channel state', async () => {
    const store = await loadStore()

    expect(store.userInfo).toBeNull()
    expect(store.authToken).toBeNull()
    expect(store.usernames).toEqual({})
    expect(store.channelList).toEqual([])
    expect(mocks.setAuthToken).toHaveBeenCalledWith(null)
  })

  it('hydrates persisted Vuex state for existing users', async () => {
    stubLocalStorage({
      vuex: JSON.stringify({
        authToken: 'token-1',
        usernames: { 'user-1': 'alice' },
        channelList: [{ id: 'channel-1', name: 'general', archived: false }]
      })
    })

    const store = await loadStore()

    expect(store.authToken).toBe('token-1')
    expect(store.usernames).toEqual({ 'user-1': 'alice' })
    expect(store.channelList).toEqual([{ id: 'channel-1', name: 'general', archived: false }])
    expect(mocks.setAuthToken).toHaveBeenCalledWith('token-1')
  })

  it('filters archived channels and looks channels up by id', async () => {
    const store = await loadStore()
    store.putChannelList([
      { id: 'active', name: 'active', parentId: '', channelName: '#active', archived: false },
      { id: 'archived', name: 'archived', parentId: '', channelName: '#archived', archived: true }
    ])

    expect(store.channelArray).toEqual([
      { id: 'active', name: 'active', parentId: '', channelName: '#active', archived: false }
    ])
    expect(store.channelById('archived')).toEqual({
      id: 'archived',
      name: 'archived',
      parentId: '',
      channelName: '#archived',
      archived: true
    })
    expect(store.channelById('missing')).toBeUndefined()
  })

  it('updates user, token, username cache, and channel list state', async () => {
    const localStorage = stubLocalStorage()
    const store = await loadStore()

    store.setUserInfo({ id: 'me' } as any)
    store.setToken('token-1')
    store.addUserNameCache({ id: 'user-1', name: 'alice' })
    store.putChannelList([{ id: 'channel-1', name: 'general', parentId: '', channelName: '#general', archived: false }])
    await nextTick()

    expect(store.userInfo).toEqual({ id: 'me' })
    expect(store.authToken).toBe('token-1')
    expect(store.usernames).toEqual({ 'user-1': 'alice' })
    expect(store.channelList).toEqual([
      { id: 'channel-1', name: 'general', parentId: '', channelName: '#general', archived: false }
    ])
    expect(mocks.setAuthToken).toHaveBeenCalledWith('token-1')
    expect(localStorage.setItem).toHaveBeenLastCalledWith('vuex', JSON.stringify({
      authToken: 'token-1',
      usernames: { 'user-1': 'alice' },
      channelList: [{ id: 'channel-1', name: 'general', parentId: '', channelName: '#general', archived: false }]
    }))
  })

  it('fetches the current user info', async () => {
    const store = await loadStore()
    mocks.traq.getMe.mockResolvedValue({ data: { id: 'me', name: 'myself' } })

    await store.fetchUserInfo()

    expect(mocks.traq.getMe).toHaveBeenCalledWith()
    expect(store.userInfo).toEqual({ id: 'me', name: 'myself' })
  })

  it('returns cached usernames without calling the API', async () => {
    const store = await loadStore()
    store.addUserNameCache({ id: 'user-1', name: 'cached-name' })

    await expect(store.fetchUserName('user-1')).resolves.toBe('cached-name')
    expect(mocks.traq.getUser).not.toHaveBeenCalled()
  })

  it('fetches missing usernames and caches them', async () => {
    const store = await loadStore()
    mocks.traq.getUser.mockResolvedValue({ data: { name: 'alice' } })

    await expect(store.fetchUserName('user-1')).resolves.toBe('alice')
    expect(mocks.traq.getUser).toHaveBeenCalledWith('user-1')
    expect(store.usernames).toEqual({ 'user-1': 'alice' })
  })

  it('returns the current error label when username fetching fails', async () => {
    const store = await loadStore()
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    mocks.traq.getUser.mockRejectedValue(new Error('network'))

    await expect(store.fetchUserName('user-1')).resolves.toBe('エラー')
    expect(store.usernames).toEqual({})
    expect(consoleError).toHaveBeenCalled()
  })

  it('fetches public channels, parses them, and stores the channel list', async () => {
    const store = await loadStore()
    const publicChannels = [{ id: 'channel-1' }]
    const parsedChannels = [{ id: 'channel-1', name: 'general', parentId: '', channelName: '#general', archived: false }]
    mocks.traq.getChannels.mockResolvedValue({ data: { public: publicChannels } })
    mocks.parseAPIChannelList.mockReturnValue(parsedChannels)

    await store.updateChannelList()

    expect(mocks.traq.getChannels).toHaveBeenCalledWith()
    expect(mocks.parseAPIChannelList).toHaveBeenCalledWith(publicChannels)
    expect(store.channelList).toEqual(parsedChannels)
  })
})
