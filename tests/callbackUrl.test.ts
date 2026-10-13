import { describe, expect, it } from 'vitest'
import { isValidCallbackUrl } from '../src/callbackUrl'

describe('isValidCallbackUrl', () => {
  it.each([
    'https://example.com/callback',
    'https://example.com/callback?foo=bar',
    'http://127.0.0.1:12345/callback',
    'http://[::1]/callback',
    'com.example.app:/oauth2redirect/example-provider',
    'jp.trap.qall:/callback',
    'jp.trap.qall://callback',
    'Com.Example.App:/callback',
  ])('accepts %s', (value) => {
    expect(isValidCallbackUrl(value)).toBe(true)
  })

  it.each([
    '',
    'not a url',
    'https://example.com/callback#fragment',
    'com.example.app:/callback#fragment',
    'com.example.app:',
    'myapp:/callback',
    'myapp://callback',
    'javascript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'file:///etc/passwd',
    'qall:1/callback',
    'myapp:1234',
    'javascript:1/alert(document.domain)',
    'https:1/../../login',
    'https:///callback',
    'http:1234',
    'ws://example.com/callback',
    'https://user:pass@example.com/callback',
    'jp.trap.qall://u:p@h/callback',
    'jp.trap.qall:/cb x',
    ' https://example.com/callback',
  ])('rejects %s', (value) => {
    expect(isValidCallbackUrl(value)).toBe(false)
  })
})
