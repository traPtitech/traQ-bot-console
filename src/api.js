import axios from 'axios'
import { randomString, pkce, hmacsha1 } from './utils'

const baseURL = process.env.VUE_APP_API_ENDPOINT || 'https://traq-dev.tokyotech.org/api/1.0'
axios.defaults.baseURL = baseURL

export function setAuthToken (token) {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    axios.defaults.headers.common.delete('Authorization')
  }
}

export async function redirectAuthorizationEndpoint () {
  const state = randomString(10)
  const codeVerifier = randomString(43)
  const codeChallenge = await pkce(codeVerifier)

  sessionStorage.setItem(`login-code-verifier-${state}`, codeVerifier)

  const authorizationEndpointUrl = new URL(`${baseURL}/oauth2/authorize`)
  authorizationEndpointUrl.search = new URLSearchParams({
    client_id: process.env.VUE_APP_API_CLIENT_ID || 'lkElAHAUIqFmImUvxmWItnbWO7EBdxttwBaW',
    response_type: 'code',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    state: state
  })
  window.location.assign(authorizationEndpointUrl)
}

export function fetchAuthToken (code, verifier) {
  return axios.post(`/oauth2/token`, new URLSearchParams({
    client_id: process.env.VUE_APP_API_CLIENT_ID || 'lkElAHAUIqFmImUvxmWItnbWO7EBdxttwBaW',
    grant_type: 'authorization_code',
    code_verifier: verifier,
    code: code
  }))
}

export function getMe () {
  return axios.get(`/users/me`)
}

export function getWebhooks () {
  return axios.get(`/webhooks`)
}

export function getWebhook (id) {
  return axios.get(`/webhooks/${id}`)
}

export function createWebhook (name, description, channelId, secret) {
  return axios.post(`/webhooks`, { name, description, channelId, secret })
}

export function deleteWebhook (id) {
  return axios.delete(`/webhooks/${id}`)
}

export function changeWebhookIcon (id, file) {
  const form = new FormData()
  form.enctype = 'multipart/form-data'
  form.append('file', file)
  return axios.put(`/webhooks/${id}/icon`, form)
}

export function patchWebhook (id, data) {
  return axios.patch(`/webhooks/${id}`, data)
}

export async function postWebhookMessage (id, message, secret) {
  const headers = {}
  if (secret && secret !== '') {
    headers['X-TRAQ-Signature'] = await hmacsha1(message, secret)
  }
  return axios.post(`/webhooks/${id}`, message, { headers })
}
