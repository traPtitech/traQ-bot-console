# Clientページを作成する

OAuth 2.0では4つの認可フローが存在します。
そのうち、traQではAuthorization Code Flowのみ利用することが可能です。

## Authorization Code Flow

### `code`の取得

ログインボタンを用意して、そのボタンをクリック時に
```
https://q.trap.jp/api/v3/oauth2/authorize
```
に以下のパラメータをつけて`GET`あるいは`POST`リクエストを行います。
`POST`の場合は`x-www-form-urlencoded`形式で送ります。

| key                   | value            | 必須  |
| :-------------------- | :--------------- | :---- |
| response_type         | code             | true  |
| client_id             | `クライアントID` | true  |
| state                 | `任意文字列`     | false |
| code_challenge        | `チャレンジ`     | false |
| code_challenge_method | `メソッド`       | false |
| scope                 | `スコープ`       | false |

stateやcode_challengeとcode_challenge_methodは付与することでCSRFを防げます。
scopeは付与すると取得するトークンのスコープを狭められます。

リクエストを送るとtraQのClient認可の承諾画面にリダイレクトされます。
この画面で承認をすると作成時に指定したURLへ`code`パラメータが付与された状態でリダイレクトされます。
この`code`パラメータを利用してトークンを取得します。

### トークンの取得

先ほどの`code`を利用して
```
https://q.trap.jp/api/v3/oauth2/token
```
に以下のパラメータを`x-www-form-urlencoded`形式でつけて`POST`リクエストを行います。

| key           | value              | 必須                                                        |
| :------------ | :----------------- | :---------------------------------------------------------- |
| grant_type    | authorization_code | true                                                        |
| client_id     | `クライアントID`   | true                                                        |
| code          | `code`             | true                                                        |
| code_verifier | `ベリファイア`     | false(`code`取得時にcode_challengeが含まれていた場合はtrue) |

レスポンスで以下のような形式でトークンが取得できます。

```json
{
  "access_token": "jvKP...3sl4",
  "token_type": "Bearer",
  "expires_in": 31536000,
  "refresh_token": "woLc...HTVZ",
  "scope": "read write",
  "id_token": "xxxxx.yyyyy.zzzzz"
}
```

| key | 説明 | フィールドが存在するか |
| :-- | :-- | :-- |
| access_token | APIにアクセスする際に用いるトークン | 常に |
| token_type | トークンの種類 常に `bearer` | 常に |
| expires_in | トークンの有効期限 (秒) | 常に |
| refresh_token | トークンのリフレッシュ時に使用 | リフレッシュトークン有効時のみ |
| scope | トークンのスコープ | 取得時からスコープが狭められた場合にのみ |
| id_token | JWT形式のID Token (OIDC) | openidスコープ要求時のみ |

`id_token` を検証することで、ユーザーIDとプロフィール情報（profileスコープ要求時のみ）を取得できます。

### `token`のリフレッシュ

執筆者募集中。書いてくれる方は#team/SysAd/randomチャンネルまで
