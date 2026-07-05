const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export function randomString(length: number): string {
  let array = new Uint8Array(length)
  window.crypto.getRandomValues(array)
  array = array.map((x) => validChars.charCodeAt(x % validChars.length))
  return String.fromCharCode(...array)
}

const b64Chars = { '+': '-', '/': '_', '=': '' }

function urlEncodeB64(input: string): string {
  return input.replace(/[+/=]/g, (m) => b64Chars[m as keyof typeof b64Chars])
}

function bufferToBase64UrlEncoded(input: ArrayBuffer): string {
  const bytes = new Uint8Array(input)
  return urlEncodeB64(window.btoa(String.fromCharCode(...bytes)))
}

function sha256(message: string): Promise<ArrayBuffer> {
  const data = new TextEncoder().encode(message)
  return window.crypto.subtle.digest('SHA-256', data)
}

function buf2hex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf), (x) => ('00' + x.toString(16)).slice(-2)).join('')
}

export async function hmacsha1(message: string, secret: string): Promise<string> {
  const key = await window.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    {
      name: 'HMAC',
      hash: 'SHA-1',
    },
    true,
    ['sign'],
  )
  const buf = new TextEncoder().encode(message)
  const sig = await window.crypto.subtle.sign('HMAC', key, buf)
  return buf2hex(sig)
}

export async function pkce(verifier: string): Promise<string> {
  return sha256(verifier).then(bufferToBase64UrlEncoded)
}

function padDatePart(value: number, length = 2): string {
  return value.toString().padStart(length, '0')
}

export function formatDateTime(
  input: string | number | Date,
  options: { milliseconds?: boolean } = {},
): string {
  const date = input instanceof Date ? input : new Date(input)
  const formatted =
    [
      padDatePart(date.getFullYear() % 100),
      padDatePart(date.getMonth() + 1),
      padDatePart(date.getDate()),
    ].join('/') +
    ' ' +
    [
      padDatePart(date.getHours()),
      padDatePart(date.getMinutes()),
      padDatePart(date.getSeconds()),
    ].join(':')

  if (options.milliseconds !== true) {
    return formatted
  }

  return `${formatted}.${padDatePart(date.getMilliseconds(), 3)}`
}

export interface APIChannel {
  id: string
  name: string
  parentId?: string | null
  archived: boolean
  children?: unknown[]
}

export interface ParsedChannel extends Omit<APIChannel, 'children' | 'parentId'> {
  parentId: string
  channelName: string
}

interface ChannelNode extends ParsedChannel {
  children: ChannelNode[]
}

function hasParent(pool: Record<string, ChannelNode>, id: string): id is keyof typeof pool {
  return id in pool
}

export function parseAPIChannelList(channels: APIChannel[]): ParsedChannel[] {
  function dfs(c: ChannelNode, root: string): void {
    c.channelName = root + c.name
    c.children.forEach((e) => dfs(e, c.channelName + '/'))
  }

  function flatMap(channels: ChannelNode[]): ParsedChannel[] {
    const children = channels.flatMap((c) => flatMap(c.children))
    return [...channels.map(({ children, ...channel }) => channel), ...children]
  }

  const pool: Record<string, ChannelNode> = Object.fromEntries(
    channels.map((c) => [
      c.id,
      {
        ...c,
        channelName: c.name,
        children: [],
        parentId: c.parentId ?? '',
      },
    ]),
  )
  // add root
  pool[''] = {
    id: '',
    name: '',
    archived: false,
    channelName: '',
    parentId: '',
    children: [],
  }

  Object.keys(pool)
    .filter((id) => id !== '')
    .forEach((id) => {
      const channel = pool[id]
      if (channel && hasParent(pool, channel.parentId)) {
        pool[channel.parentId]!.children.push(channel)
      }
    })
  Object.keys(pool)
    .filter((id) => id !== '')
    .forEach((id) => {
      const channel = pool[id]
      if (!channel || !hasParent(pool, channel.parentId)) return

      pool[channel.parentId]!.children.sort((lhs, rhs) => {
        if (lhs.name < rhs.name) return -1
        if (lhs.name > rhs.name) return 1
        return 0
      })
    })
  pool['']?.children.forEach((e) => dfs(e, '#'))

  return flatMap(pool['']?.children ?? []).sort((lhs, rhs) => {
    if (lhs.channelName < rhs.channelName) return -1
    if (lhs.channelName > rhs.channelName) return 1
    return 0
  })
}
