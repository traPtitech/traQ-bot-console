const urlRegex = /http(s)?:\/\/([\w-]+.)+[\w-]+(\/[\w- ./?%&=]*)?/i

// リバースドメイン形式のURIスキーム (例: com.example.app)
const privateUseSchemeRegex = /^[a-z][a-z0-9+-]*(\.[a-z0-9+-]+)+$/

// RFC 3986 の absolute-URI
const absoluteUriRegex = (() => {
  const unreserved = String.raw`[A-Za-z0-9\-._~]`
  const pctEncoded = '%[0-9A-Fa-f]{2}'
  const subDelims = "[!$&'()*+,;=]"
  const h16 = '[0-9A-Fa-f]{1,4}'
  const decOctet = '(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])'
  const pchar = `(?:${unreserved}|${pctEncoded}|${subDelims}|[:@])`
  const ipv4 = `${decOctet}\\.${decOctet}\\.${decOctet}\\.${decOctet}`
  const ls32 = `(?:${h16}:${h16}|${ipv4})`
  const ipv6 = [
    `(?:${h16}:){6}${ls32}`,
    `::(?:${h16}:){5}${ls32}`,
    `(?:${h16})?::(?:${h16}:){4}${ls32}`,
    `(?:(?:${h16}:){0,1}${h16})?::(?:${h16}:){3}${ls32}`,
    `(?:(?:${h16}:){0,2}${h16})?::(?:${h16}:){2}${ls32}`,
    `(?:(?:${h16}:){0,3}${h16})?::${h16}:${ls32}`,
    `(?:(?:${h16}:){0,4}${h16})?::${ls32}`,
    `(?:(?:${h16}:){0,5}${h16})?::${h16}`,
    `(?:(?:${h16}:){0,6}${h16})?::`,
  ].join('|')
  const ipLiteral = `\\[(?:${ipv6}|v[0-9A-Fa-f]+\\.(?:${unreserved}|${subDelims}|:)+)\\]`
  const regName = `(?:${unreserved}|${pctEncoded}|${subDelims})*`
  const userinfo = `(?:${unreserved}|${pctEncoded}|${subDelims}|:)*`
  const authority = `(?:${userinfo}@)?(?:${ipLiteral}|${ipv4}|${regName})(?::[0-9]*)?`
  const hierPart =
    `(?://${authority}(?:/${pchar}*)*` +
    `|/(?:${pchar}+(?:/${pchar}*)*)?` +
    `|${pchar}+(?:/${pchar}*)*` +
    '|)'
  const query = `(?:${pchar}|[/?])*`
  return new RegExp(`^[A-Za-z][A-Za-z0-9+\\-.]*:${hierPart}(?:\\?${query})?$`)
})()

// URL、またはリバースドメイン形式のスキームの URI を許可する (後者は traQ 側と同じ条件)
export function isValidCallbackUrl(value: string): boolean {
  if (urlRegex.test(value)) {
    return true
  }
  const [scheme = ''] = value.split(':', 1)
  return privateUseSchemeRegex.test(scheme.toLowerCase()) && absoluteUriRegex.test(value)
}
