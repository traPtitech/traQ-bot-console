// リバースドメイン形式のURIスキーム (例: com.example.app)
const privateUseSchemeRegex = /^[a-z][a-z0-9+-]*(\.[a-z0-9+-]+)+$/

// traQ 側と同じく、http(s) の URL またはリバースドメイン形式のスキームの URI を許可する
export function isValidCallbackUrl(value: string): boolean {
  if (value.includes('#') || /\s/.test(value)) {
    return false
  }

  let url: URL
  try {
    url = new URL(value)
  } catch {
    return false
  }
  if (url.username !== '' || url.password !== '') {
    return false
  }

  const scheme = url.protocol.slice(0, -1).toLowerCase()
  if (scheme === 'http' || scheme === 'https') {
    // "https:1/path" のような URL も補完して解釈されるため、"//" の後にホストがあることを確認する
    return /^https?:\/\/[^/]/i.test(value) && url.hostname !== ''
  }
  return privateUseSchemeRegex.test(scheme) && value.length > url.protocol.length
}
