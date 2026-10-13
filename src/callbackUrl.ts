// リバースドメイン形式のプライベートスキーム名 (RFC 8252 Section 7.1, RFC 3986 Section 3.1)
// "." を含まないスキーム (javascript, data 等) はマッチしない
const privateUseSchemeRegex = /^[a-z][a-z0-9+-]*(\.[a-z0-9+-]+)+$/

/**
 * Client のリダイレクト先 URL として有効かどうか
 *
 * traQ 側の検証と同じく、ホストを持つ http(s) の URL と、ネイティブアプリ向けの
 * リバースドメイン形式のプライベートスキーム (例: com.example.app:/callback) のみを許可する。
 * フラグメント (RFC 6749 Section 3.1.2)・ユーザー情報・空白を含む URL は許可しない。
 */
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
    // URL は "https:1/path" を "https://0.0.0.1/path" のように補完して解釈するため、"//" の後にホストがあることを確認する
    return /^https?:\/\/[^/]/i.test(value) && url.hostname !== ''
  }
  return privateUseSchemeRegex.test(scheme) && value.length > url.protocol.length
}
