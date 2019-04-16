import axios from 'axios'
import { randomString, pkce, hmacsha1 } from './utils'

export const baseURL = process.env.VUE_APP_API_ENDPOINT || 'https://traq-dev.tokyotech.org/api/1.0'
axios.defaults.baseURL = baseURL

export function setAuthToken (token) {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete axios.defaults.headers.common['Authorization']
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
    state
  })
  window.location.assign(authorizationEndpointUrl)
}

export function fetchAuthToken (code, verifier) {
  return axios.post(`/oauth2/token`, new URLSearchParams({
    client_id: process.env.VUE_APP_API_CLIENT_ID || 'lkElAHAUIqFmImUvxmWItnbWO7EBdxttwBaW',
    grant_type: 'authorization_code',
    code_verifier: verifier,
    code
  }))
}

export function revokeAuthToken (token) {
  return axios.post(`/oauth2/revoke`, new URLSearchParams({ token }))
}

export function getMe () {
  return axios.get(`/users/me`)
}

export function getUser (id) {
  return axios.get(`/users/${id}`)
}

export function getUserIconURL (name) {
  return `${baseURL}/public/icon/${encodeURIComponent(name)}`
}

export function getChannels () {
  return axios.get(`/channels`)
}

export function getChannel (id) {
  return axios.get(`/channels/${id}`)
}

export function getWebhooks () {
  return axios.get(`/webhooks?all=1`)
}

export function getWebhook (id) {
  return axios.get(`/webhooks/${id}`)
}

export function getWebhookMessages (id) {
  return axios.get(`/webhooks/${id}/messages?limit=10`)
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
  const headers = {
    'Content-Type': 'text/plain; charset=UTF-8'
  }
  if (secret && secret !== '') {
    headers['X-TRAQ-Signature'] = await hmacsha1(message, secret)
  }
  return axios.post(`/webhooks/${id}`, message, { headers })
}

export async function getBots () {
  return axios.get(`/bots`)
}

export async function getBotDetail (id) {
  return axios.get(`/bots/${id}/detail`)
}

export async function createBot (name, displayName, description, webhookUrl) {
  return axios.post(`/bots`, { name, displayName, description, webhookUrl })
}

export async function changeBotEvents (id, events) {
  return axios.put(`/bots/${id}/events`, { events })
}

export async function deleteBot (id) {
  return axios.delete(`/bots/${id}`)
}

export async function revokeBotTokens (id) {
  return axios.post(`/bots/${id}/reissue`)
}

export async function putBotState (id, state) {
  return axios.put(`/bots/${id}/state`, { state })
}

export async function getBotInstalledChannels (id) {
  return axios.get(`/bots/${id}/channels`)
}

export async function addBotToChannel (botCode, channelId) {
  return axios.post(`/channels/${channelId}/bots`, { code: botCode })
}

export async function removeBotFromChannel (botId, channelId) {
  return axios.delete(`/channels/${channelId}/bots/${botId}`)
}

export async function getBotEventLogs (botId, limit, offset) {
  return axios.get(`/bots/${botId}/events/logs`, { params: { limit, offset } })
}
