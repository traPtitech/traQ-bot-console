# traQ BOT 概要

## BOTを登録する
サーバーからリクエストを受け取る際に必要な認証情報やBOTのtraQ側の設定を行います。  
詳細は[BOTを新規登録する](/docs/bot/register)を参照してください。

## イベントを受け取る機構

traQ BOTでは、traQからイベントの受け取り方（動作モード）を2種類から選ぶことができます。
1. HTTP Modeでは、HTTPリクエストによってtraQからイベントを送信します。そのため、外部からアクセスが可能なBOTサーバーを建てる必要があります。詳細は[HTTP BOTサーバーを建てる](/docs/bot/http-server)を参照してください。
2. WebSocket Modeでは、WebSocketによってtraQからイベントを送信します。BOTを外部からアクセス可能にする必要がないため、NAT下のネットワークでも使用可能になり、開発やデプロイが楽になるなどの利点があります。詳細は[WebSocket BOTを作る](/docs/bot/ws-server)を参照してください。

traQから受け取れるイベントは[BOTイベントリファレンス](/docs/bot/events)にあります。

## リクエストを送る機構

上のイベントから欲しい情報を得たのち、traQへ必要なリクエストを送ることによって相互作用を実現できます。

traQへ送ることができるリクエストは[traQ API リファレンス](/docs/bot/traq-api)にあります。  
