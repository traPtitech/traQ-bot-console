// リバースドメイン形式のプライベートスキーム名 (RFC 8252 Section 7.1, RFC 3986 Section 3.1)
// "." を含まないスキーム (javascript, data 等) はマッチしない
const privateUseSchemeRegex = /^[a-z][a-z0-9+-]*(\.[a-z0-9+-]+)+$/

/**
 * Client のリダイレクト先 URL として有効かどうか
 *
 * traQ 側の検証と同じく、http(s) の URL に加えて、ネイティブアプリ向けの
 * リバースドメイン形式のプライベートスキーム (例: com.example.app:/callback) を許可する。
 * フラグメントを含む URL は許可しない (RFC 6749 Section 3.1.2)。
 */
export function isValidCallbackUrl(value: string): boolean {
  if (value.includes('#')) {
    return false
  }

  let url: URL
  try {
    url = new URL(value)
  } catch {
    return false
  }

  const scheme = url.protocol.slice(0, -1).toLowerCase()
  if (scheme === 'http' || scheme === 'https') {
    return url.hostname !== ''
  }
  return privateUseSchemeRegex.test(scheme) && value.length > url.protocol.length
}
