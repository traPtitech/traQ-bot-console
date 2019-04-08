# HMAC-SHA1の計算方法
ここに載っていない言語についてはグーグル等で検索してください

## Go
```go
import (
	"crypto/hmac"
	"crypto/sha1"
	"encoding/hex"
)

func CalcHMACSHA1(message, secret string) string {
	mac := hmac.New(sha1.New, []byte(secret))
	_, _ = mac.Write([]byte(message))
	return hex.EncodeToString(mac.Sum(nil))
}
```

## javascript (ブラウザ・ES6)
```javascript
async function calcHMACSHA1 (message, secret) {
  const key = await window.crypto.subtle.importKey('raw', new TextEncoder().encode(secret), {
    name: 'HMAC',
    hash: 'SHA-1'
  }, true, ['sign'])
  const buf = new TextEncoder().encode(message)
  const sig = await window.crypto.subtle.sign('HMAC', key, buf)
  return Array.prototype.map.call(new Uint8Array(sig), x => (('00' + x.toString(16)).slice(-2))).join('')
}
```

## javascript (nodejs)
```javascript
var crypto = require('crypto')

function calcHMACSHA1(message, secret) {
  return crypto.createHmac('sha1', secret).update(message).digest('hex')
}
```

## bash(sh)
`openssl`コマンドがインストールされている必要があります。

```bash
echo -n "message" | openssl sha1 -hmac "secret"
```
