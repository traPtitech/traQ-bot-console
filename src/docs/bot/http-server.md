# HTTP BOTサーバーを建てる

HTTP ModeのBOTには、イベントが発生するたびにtraQサーバーからHTTPリクエストが送られてきます。

## リクエストの形式

+ Header
  + `X-TRAQ-BOT-EVENT`: イベント名
  + `X-TRAQ-BOT-REQUEST-ID`: リクエストID
  + `X-TRAQ-BOT-TOKEN`: VerificationToken
+ Body
  + JSON

Headerの`X-TRAQ-BOT-TOKEN`に含まれるVerificationTokenが登録時に表示されたものと同一のものかどうかを検証することで、正規のtraQサーバーからのリクエストかどうかを判定できます。

イベント名とBodyに送られてくるJSONは[BOTイベントリファレンス](/docs/bot/events)を参照してください。

## アクティベーション

HTTP ModeのBOTを有効にするには、「アクティベーション」によってtraQとBOTサーバー間の疎通確認を行う必要があります。

traQからの`PING`イベントに`204 No Content`で返答するようにBOTサーバーを設定してください。

その後、BOTの詳細画面から`アクティベーション`をクリック、リロードの上、BOTのステータスが「有効」になっていることを確認します。
有効になるとtraQからイベントの送信が開始され、BOTが動作するようになります。

## ライブラリ

ライブラリを使用すると、簡単にHTTP BOTサーバーを建てることができます。

+ [traPtitech/traq-bot: traQ BOT用Goライブラリ](https://github.com/traPtitech/traq-bot)
+ [sapphi-red/hubot-traq: Hubot adapter for traQ](https://github.com/sapphi-red/hubot-traq) (JavaScript, CoffeeScript)
