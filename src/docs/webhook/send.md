# Webhookでメッセージを送信する
Webhookのメッセージ送信方式は、`Secure`と`Insecure`の2種類があります。

Webhook毎の使用可能は送信方式はどちらか一方のみであり、Webhookの作成・編集画面から`Webhookシークレット`を、
+ 登録している場合： `Secure`方式
+ 登録していない場合： `Insecure`方式

を使うことができます。

==可能な限りSecure方式を使用してください==

## Insecure方式
Insecure方式では、 ==`Webhook ID`を知っている人は誰でもメッセージ投稿が可能です== ので、`Webhook ID`が第三者に漏れないように注意する必要があります。

#### 使用方法
1. 使用するWebhookの詳細画面から、Webhookの`Webhook ID`をコピーします。
2. Webhookを送信するサービス・アプリケーションから、
    + `https://q.trap.jp/api/1.0/webhooks/{コピーしたWebhook ID}`宛に
    + `Content-Type: text/plain; charset=utf-8`形式で
    + 投稿するメッセージをリクエストボディに含めてHTTP POSTで送信します。
3. 使用したWebhookに登録してあるチャンネルにメッセージが投稿されます。 

## Secure方式
Webhook作成・編集時に登録した`Webhookシークレット`が必要になります。

Secure方式では`Webhookシークレット`を鍵としてメッセージ本文を`HMAC-SHA1`でハッシュ化した結果を同時に送信し、
traQサーバーがWebhookの送信元の正当性を検証します。

これによって、 ==Webhookシークレットが流出しない限り、== 悪意のあるクライアント・Webhookを無断使用する第三者からのメッセージ投稿を拒否することができます。

#### 使用方法
1. 使用するWebhookの詳細画面から、Webhookの`Webhook ID`をコピーします。
2. Webhookを送信するサービス・アプリケーションから、
    + `https://q.trap.jp/api/1.0/webhooks/{コピーしたWebhook ID}`宛に
    + `Content-Type: text/plain; charset=utf-8`形式で
    + 投稿するメッセージをリクエストボディに含め、更にリクエストヘッダに、
    + `X-TRAQ-Signature: {メッセージ本文をWebhookシークレットでHMAC-SHA1でハッシュ化した結果をhex形式で表した文字列}`
    + を載せてHTTP POSTで送信します。
3. 使用したWebhookに登録してあるチャンネルにメッセージが投稿されます。 

#### [HMAC-SHA1の計算方法](/docs/webhook/hmacsha1)
