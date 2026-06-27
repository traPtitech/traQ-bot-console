import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  createStore: vi.fn(config => config),
  createPersistedState: vi.fn(() => 'persisted-plugin'),
  setAuthToken: vi.fn(),
  parseAPIChannelList: vi.fn(),
  traq: {
    getMe: vi.fn(),
    getUser: vi.fn(),
    getChannels: vi.fn()
  }
}))

vi.mock('vuex', () => ({
  createStore: mocks.createStore
}))

vi.mock('vuex-persistedstate', () => ({
  default: mocks.createPersistedState
}))

vi.mock('../src/api', () => ({
  traq: mocks.traq,
  setAuthToken: mocks.setAuthToken
}))

vi.mock('../src/utils', () => ({
  parseAPIChannelList: mocks.parseAPIChannelList
}))

async function loadStoreConfig (): Promise<any> {
  vi.resetModules()
  return (await import('../src/store')).store
}

describe('store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.traq.getMe.mockReset()
    mocks.traq.getUser.mockReset()
    mocks.traq.getChannels.mockReset()
    mocks.parseAPIChannelList.mockReset()
  })

  it('creates the store with persisted auth, username, and channel state', async () => {
    const store = await loadStoreConfig()

    expect(mocks.createStore).toHaveBeenCalledWith(store)
    expect(mocks.createPersistedState).toHaveBeenCalledWith({
      paths: ['authToken', 'usernames', 'channelList']
    })
    expect(store.plugins).toEqual(['persisted-plugin'])
    expect(store.state).toEqual({
      userInfo: null,
      authToken: null,
      usernames: {},
      channelList: []
    })
  })

  it('filters archived channels and looks channels up by id', async () => {
    const store = await loadStoreConfig()
    const state = {
      channelList: [
        { id: 'active', archived: false },
        { id: 'archived', archived: true }
      ]
    }

    expect(store.getters.getChannelArray(state)).toEqual([{ id: 'active', archived: false }])
    expect(store.getters.getChannel(state)('archived')).toEqual({ id: 'archived', archived: true })
    expect(store.getters.getChannel(state)('missing')).toBeUndefined()
  })

  it('mutates user, token, username cache, and channel list state', async () => {
    const store = await loadStoreConfig()
    const state = {
      userInfo: null,
      authToken: null,
      usernames: {},
      channelList: []
    }

    store.mutations.setUserInfo(state, { id: 'me' })
    store.mutations.setToken(state, 'token-1')
    store.mutations.addUserNameCache(state, { id: 'user-1', name: 'alice' })
    store.mutations.putChannelList(state, [{ id: 'channel-1' }])

    expect(state).toEqual({
      userInfo: { id: 'me' },
      authToken: 'token-1',
      usernames: { 'user-1': 'alice' },
      channelList: [{ id: 'channel-1' }]
    })
    expect(mocks.setAuthToken).toHaveBeenCalledWith('token-1')
  })

  it('fetches and commits the current user info', async () => {
    const store = await loadStoreConfig()
    const commit = vi.fn()
    mocks.traq.getMe.mockResolvedValue({ data: { id: 'me', name: 'myself' } })

    await store.actions.fetchUserInfo({ commit })

    expect(mocks.traq.getMe).toHaveBeenCalledWith()
    expect(commit).toHaveBeenCalledWith('setUserInfo', { id: 'me', name: 'myself' })
  })

  it('returns cached usernames without calling the API', async () => {
    const store = await loadStoreConfig()

    await expect(store.actions.fetchUserName({
      state: { usernames: { 'user-1': 'cached-name' } },
      commit: vi.fn()
    }, 'user-1')).resolves.toBe('cached-name')
    expect(mocks.traq.getUser).not.toHaveBeenCalled()
  })

  it('fetches missing usernames and caches them', async () => {
    const store = await loadStoreConfig()
    const commit = vi.fn()
    mocks.traq.getUser.mockResolvedValue({ data: { name: 'alice' } })

    await expect(store.actions.fetchUserName({
      state: { usernames: {} },
      commit
    }, 'user-1')).resolves.toBe('alice')
    expect(mocks.traq.getUser).toHaveBeenCalledWith('user-1')
    expect(commit).toHaveBeenCalledWith('addUserNameCache', { id: 'user-1', name: 'alice' })
  })

  it('returns the current error label when username fetching fails', async () => {
    const store = await loadStoreConfig()
    const commit = vi.fn()
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    mocks.traq.getUser.mockRejectedValue(new Error('network'))

    await expect(store.actions.fetchUserName({
      state: { usernames: {} },
      commit
    }, 'user-1')).resolves.toBe('エラー')
    expect(commit).not.toHaveBeenCalled()
    expect(consoleError).toHaveBeenCalled()
  })

  it('fetches public channels, parses them, and commits the channel list', async () => {
    const store = await loadStoreConfig()
    const publicChannels = [{ id: 'channel-1' }]
    const parsedChannels = [{ id: 'channel-1', channelName: '#general' }]
    const commit = vi.fn()
    mocks.traq.getChannels.mockResolvedValue({ data: { public: publicChannels } })
    mocks.parseAPIChannelList.mockReturnValue(parsedChannels)

    await store.actions.updateChannelList({ commit })

    expect(mocks.traq.getChannels).toHaveBeenCalledWith()
    expect(mocks.parseAPIChannelList).toHaveBeenCalledWith(publicChannels)
    expect(commit).toHaveBeenCalledWith('putChannelList', parsedChannels)
  })
})
