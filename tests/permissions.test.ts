import { describe, expect, it } from 'vitest'
import {
  canAccessOthersBots,
  canAccessOthersWebhooks,
  canManageOthersClients,
  type UserPermissions,
} from '../src/permissions'

describe('permissions', () => {
  it('detects list permissions for other users resources', () => {
    const userInfo: UserPermissions = {
      permissions: ['access_others_bot', 'access_others_webhook', 'manage_others_client'],
    }

    expect(canAccessOthersBots(userInfo)).toBe(true)
    expect(canAccessOthersWebhooks(userInfo)).toBe(true)
    expect(canManageOthersClients(userInfo)).toBe(true)
  })

  it('returns false when list permissions are missing', () => {
    const userInfo: UserPermissions = {
      permissions: ['get_webhook'],
    }

    expect(canAccessOthersBots(userInfo)).toBe(false)
    expect(canAccessOthersWebhooks(userInfo)).toBe(false)
    expect(canManageOthersClients(userInfo)).toBe(false)
  })

  it('returns false before the current user info is loaded', () => {
    expect(canAccessOthersBots(null)).toBe(false)
    expect(canAccessOthersWebhooks(undefined)).toBe(false)
    expect(canManageOthersClients(null)).toBe(false)
  })
})
