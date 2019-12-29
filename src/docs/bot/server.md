# BOTサーバーを建てる

traQサーバーからイベントが発生するたびに以下のようなHTTPリクエストが送られてきます。

+ body
  + JSON
+ header
  + `X-TRAQ-BOT-TOKEN`: `VerificationToken`
  + `X-TRAQ-BOT-EVENT`: イベント名

イベントの名前とbodyに送られてくるJSONは[BOTイベントリファレンス](/docs/bot/events)を参照してください。

このHTTPリクエストを処理してtraQサーバーへリクエストを送るようにします。

traQのAPIについては[traQ APIリファレンス](/docs/bot/traq-api)を参照してください。

## ライブラリ
+ [Go用補助ライブラリ](https://github.com/traPtitech/traq-bot)
+ [Hubot(JavaScript, CoffeeScript)拡張](https://github.com/sapphi-red/hubot-traq)
