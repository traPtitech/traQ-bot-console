import { beforeEach, describe, expect, it, vi } from 'vitest'
import { webcrypto } from 'node:crypto'

type TestWindow = {
  crypto: Crypto
  btoa: (input: string) => string
}

function installBrowserCrypto (): void {
  vi.stubGlobal('window', {
    crypto: webcrypto as unknown as Crypto,
    btoa: input => Buffer.from(input, 'binary').toString('base64')
  } satisfies TestWindow)
}

describe('utils', () => {
  beforeEach(() => {
    installBrowserCrypto()
  })

  it('generates random strings with the expected alphabet and length', async () => {
    const { randomString } = await import('../src/utils')
    const bytes = [0, 25, 26, 51, 52, 61]

    window.crypto.getRandomValues = vi.fn((array: Uint8Array) => {
      bytes.forEach((byte, index) => {
        array[index] = byte
      })
      return array
    }) as Crypto['getRandomValues']

    expect(randomString(bytes.length)).toBe('AZaz09')
    expect(window.crypto.getRandomValues).toHaveBeenCalledWith(expect.any(Uint8Array))
  })

  it('creates RFC 7636 compatible PKCE challenges', async () => {
    const { pkce } = await import('../src/utils')

    await expect(pkce('dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk'))
      .resolves.toBe('E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM')
  })

  it('calculates HMAC-SHA1 signatures as lowercase hex', async () => {
    const { hmacsha1 } = await import('../src/utils')

    await expect(hmacsha1('The quick brown fox jumps over the lazy dog', 'key'))
      .resolves.toBe('de7c9b85b8b78aa6bc8a7a36f70a90701c9db4d9')
  })

  it('flattens public channels with full names, sorted by channel path', async () => {
    const { parseAPIChannelList } = await import('../src/utils')
    const channels = [
      { id: 'project', name: 'project', parentId: 'general', archived: false, children: ['ignored'] },
      { id: 'zeta', name: 'zeta', parentId: null, archived: false },
      { id: 'general', name: 'general', parentId: null, archived: false },
      { id: 'alpha', name: 'alpha', parentId: 'general', archived: true },
      { id: 'random', name: 'random', parentId: undefined, archived: false }
    ]

    expect(parseAPIChannelList(channels)).toEqual([
      { id: 'general', name: 'general', parentId: '', archived: false, channelName: '#general' },
      { id: 'alpha', name: 'alpha', parentId: 'general', archived: true, channelName: '#general/alpha' },
      { id: 'project', name: 'project', parentId: 'general', archived: false, channelName: '#general/project' },
      { id: 'random', name: 'random', parentId: '', archived: false, channelName: '#random' },
      { id: 'zeta', name: 'zeta', parentId: '', archived: false, channelName: '#zeta' }
    ])
    expect(channels[0].children).toEqual(['ignored'])
  })
})
