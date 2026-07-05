import { Apis as TraQ } from '@traptitech/traq'
import type { Configuration, User } from '@traptitech/traq'
import { randomString, pkce, hmacsha1 } from './utils'

export const baseURL = import.meta.env['VITE_API_ENDPOINT'] || 'https://q-dev.trapti.tech/api/v3'

export let traq: TraQ = new TraQ({
  basePath: baseURL,
} as Configuration)

export function setAuthToken(token: string | null): void {
  traq = new TraQ({
    basePath: baseURL,
    accessToken: token ?? undefined,
  } as Configuration)
}

export async function redirectAuthorizationEndpoint() {
  const state = randomString(10)
  const codeVerifier = randomString(43)
  const codeChallenge = await pkce(codeVerifier)

  sessionStorage.setItem(`login-code-verifier-${state}`, codeVerifier)

  const authorizationEndpointUrl = new URL(`${baseURL}/oauth2/authorize`)
  authorizationEndpointUrl.search = new URLSearchParams({
    client_id: import.meta.env['VITE_API_CLIENT_ID'] || 'lkElAHAUIqFmImUvxmWItnbWO7EBdxttwBaW',
    response_type: 'code',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    state,
  }).toString()
  window.location.assign(authorizationEndpointUrl)
}

export function fetchAuthToken(
  code: string | null | Array<string | null> | undefined,
  verifier: string | null,
) {
  const normalizedCode = Array.isArray(code) ? code[0] : code
  if (!normalizedCode || !verifier) {
    return Promise.reject(new Error('code or verifier is missing'))
  }

  return traq.postOAuth2Token(
    'authorization_code',
    normalizedCode,
    undefined,
    import.meta.env['VITE_API_CLIENT_ID'] || 'lkElAHAUIqFmImUvxmWItnbWO7EBdxttwBaW',
    verifier,
  )
}

export function getUserIconURL(name: string): string {
  return `${baseURL}/public/icon/${encodeURIComponent(name)}`
}

export async function postWebhookMessage(id: string, message: string, secret = '') {
  const signature = secret !== '' ? await hmacsha1(message, secret) : undefined
  return traq.postWebhook(id, signature, undefined, undefined, message)
}

export interface UserOptionItem {
  label: string
  value: User
}

export async function getUsersOptionItems(ownerId: string): Promise<UserOptionItem[]> {
  const users = (await traq.getUsers()).data
  const items = users
    .filter(
      (user) =>
        !user.name.startsWith('Webhook#') && !user.name.startsWith('BOT_') && user.id !== ownerId,
    )
    .map((user) => ({ label: `@${user.name}`, value: user }))
  items.sort((a, b) => (a.value.name.toLowerCase() > b.value.name.toLowerCase() ? 1 : -1))
  return items
}
