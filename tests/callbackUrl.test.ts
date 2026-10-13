import { describe, expect, it } from 'vitest'
import { isValidCallbackUrl } from '../src/callbackUrl'

describe('isValidCallbackUrl', () => {
  it.each([
    'https://example.com/callback',
    'https://example.com/callback?foo=bar',
    'http://127.0.0.1:12345/callback',
    'com.example.app:/oauth2redirect/example-provider',
    'jp.trap.qall://callback',
    'jp.trap.qall://[::1]/callback',
    'com.example.app:callback',
    'com.example.app:?foo=bar',
    'com.example.app:',
    'Com.Example.App:/callback',
    'com.example-app.v2+x:/callback',
  ])('accepts %s', (value) => {
    expect(isValidCallbackUrl(value)).toBe(true)
  })

  it.each([
    '',
    'not a url',
    'myapp:/callback',
    'myapp://callback',
    'com.:/callback',
    'com..example:/callback',
    'com.example.app:/callback#foo',
    'com.example.app:/a\\b',
    'com.example.app:%zz',
    'jp.trap.qall:/cb x',
    'com.example.app:/caf\u00e9',
    'javascript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'file:///etc/passwd',
  ])('rejects %s', (value) => {
    expect(isValidCallbackUrl(value)).toBe(false)
  })
})
