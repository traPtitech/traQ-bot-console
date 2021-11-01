# WebSocket BOTを作る

WebSocket ModeのBOTは規定のエンドポイントへWebSocketの接続をすることで、イベントの受け取りを開始することができます。

HTTP Modeのようにアクティベーションの必要はありませんが、もしBOTのステータスが停止または一時停止になっている場合は、BOTの詳細画面から`アクティベーション`をクリックすることで有効化できます。

## イベントの形式

TextMessageとして各種イベントが`type`、`reqId`、`body`を持つJSONとして非同期に送られます。

+ `type`: イベント名
+ `reqId`: リクエストID
+ `body`: イベント情報 HTTP Modeの場合のRequest Bodyと同様

例外として、`ERROR`イベントは`reqId`を持ちません。

例: PINGイベント

`{"type":"PING","reqId":"requestId","body":{"eventTime":"2019-05-07T04:50:48.582586882Z"}}`

イベント名と`body`に送られてくるJSONは[BOTイベントリファレンス](/docs/bot/events)を参照してください。

詳細なイベントの形式は[traQ API リファレンス](https://apis.trap.jp/#/bot/connectBotWS)を参考にしてください。

## メッセージの送信

WebSocket Modeでは、WebSocket経由でtraQサーバーからイベントを受け取ることに加えて、WebSocket経由でBOTからtraQサーバーにコマンドを送信することができます。

コマンドの形式が間違っていた場合は、ERRORイベントが非同期で配信されます。

詳細な送信形式は[traQ API リファレンス](https://apis.trap.jp/#/bot/connectBotWS)を参考にしてください。

## ライブラリ

ライブラリを使用すると、簡単にWebSocket BOTを作ることができます。

+ [traPtitech/traq-ws-bot: traQ WebSocket BOT用ライブラリ](https://github.com/traPtitech/traq-ws-bot)
