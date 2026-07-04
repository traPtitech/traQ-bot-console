import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { fetchAuthToken, redirectAuthorizationEndpoint } from '../api'
import { appStore as store } from '../store'

const getResponseStatus = (error: unknown): number | undefined => {
  if (typeof error !== 'object' || error === null || !('response' in error)) {
    return undefined
  }

  const { response } = error
  if (typeof response !== 'object' || response === null || !('status' in response)) {
    return undefined
  }

  const { status } = response
  return typeof status === 'number' ? status : undefined
}

export async function requireAuthentication(): Promise<undefined | false> {
  try {
    await store.fetchUserInfo()
    await store.updateChannelList()
    return undefined
  } catch (e) {
    const status = getResponseStatus(e)
    if (status === 401 || status === 403) {
      await redirectAuthorizationEndpoint()
      return false
    }
    throw e
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
