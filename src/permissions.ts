import type { MyUserDetail } from '@traptitech/traq'

type UserPermission = MyUserDetail['permissions'][number]
export type UserPermissions = Pick<MyUserDetail, 'permissions'>

const hasPermission = (
  userInfo: UserPermissions | null | undefined,
  permission: UserPermission,
): boolean => userInfo?.permissions.includes(permission) ?? false

export const canAccessOthersWebhooks = (userInfo: UserPermissions | null | undefined): boolean =>
  hasPermission(userInfo, 'access_others_webhook')

export const canAccessOthersBots = (userInfo: UserPermissions | null | undefined): boolean =>
  hasPermission(userInfo, 'access_others_bot')

export const canManageOthersClients = (userInfo: UserPermissions | null | undefined): boolean =>
  hasPermission(userInfo, 'manage_others_client')
