import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { fetchAuthToken, redirectAuthorizationEndpoint } from '../api'
import { appStore as store } from '../store'

export async function requireAuthentication(): Promise<undefined | false> {
  try {
    await store.fetchUserInfo()
    await store.updateChannelList()
    return undefined
  } catch (e) {
    await redirectAuthorizationEndpoint()
    return false
  }
}

export async function handleOAuthCallback(
  to: RouteLocationNormalized,
): Promise<RouteLocationRaw | false> {
  const code = to.query['code']
  const state = to.query['state']
  const codeVerifier = sessionStorage.getItem(`login-code-verifier-${state}`)
  if (!code || !codeVerifier) {
    return { name: 'home' }
  }

  try {
    const res = await fetchAuthToken(code, codeVerifier)
    store.setToken(res.data.access_token)
    return { name: 'home' }
  } catch (e) {
    console.error(e)
    return false
  }
}
