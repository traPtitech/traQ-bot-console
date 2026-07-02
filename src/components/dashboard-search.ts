import type { Bot, OAuth2Client, Webhook } from '@traptitech/traq'

export type DashboardWebhook = Webhook & {
  botUserName: string
  ownerName?: string
}

export type DashboardBot = Bot & {
  botUserName: string
  developerName?: string
}

export type DashboardClient = OAuth2Client & {
  developerName?: string
  scopeLabels: string[]
}

export function normalizeDashboardSearchQuery(query: string): string {
  return query.trim().toLowerCase()
}

export function matchesDashboardSearch(
  query: string,
  fields: readonly (string | undefined)[],
): boolean {
  const normalizedQuery = normalizeDashboardSearchQuery(query)
  if (normalizedQuery === '') return true

  return fields.some((field) => field?.toLowerCase().includes(normalizedQuery) ?? false)
}

export function filterDashboardItems<T>(
  items: readonly T[],
  query: string,
  getFields: (item: T) => readonly (string | undefined)[],
): T[] {
  return items.filter((item) => matchesDashboardSearch(query, getFields(item)))
}

export const getWebhookSearchFields = (
  webhook: DashboardWebhook,
): readonly (string | undefined)[] => [
  webhook.displayName,
  webhook.description,
  webhook.botUserName,
  webhook.ownerName,
]

export const getBotSearchFields = (bot: DashboardBot): readonly (string | undefined)[] => [
  bot.botUserName,
  bot.description,
  bot.developerName,
]

export const getClientSearchFields = (client: DashboardClient): readonly (string | undefined)[] => [
  client.name,
  client.description,
  ...client.scopeLabels,
  client.developerName,
]
