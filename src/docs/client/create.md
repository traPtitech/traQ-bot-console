# Clientを新規登録する

Clientは[Client新規登録ページ](/clients/create)から登録することができます。

## 登録項目の説明

### Client名

Client名はユーザーがClientの承認する際に表示される名前です。
あとから変更することが可能です。

### 説明

説明には、Clientの使用用途を入力してください。

### リダイレクト先URL

Clientの承認後にリダイレクトされるURLです。
リダイレクト時に`code`パラメータが付加されます。
この`code`パラメータを利用することで`token`を取得できます。
`token`に関する説明は[こちら](/docs/client/page)

### 権限

Clientの利用する権限です。
**あとから変更することはできません。**
それぞれの権限で以下のようなことができます

#### ユーザー識別子

+ traQ IDとUUIDの取得

#### プロフィール情報

+ 自ユーザー情報の取得

#### 読み取り

+ チャンネル情報の取得
+ メッセージの取得
+ チャンネル購読状況(通知をつけているか)の取得
+ 通知の受け取り
+ ユーザー情報の取得
+ 自ユーザー情報の取得
+ クリップの取得
+ クリップフォルダの取得
+ スター(お気に入り)チャンネルの取得
+ 未読メッセージ一覧の取得
+ ミュートチャンネルの取得
+ ユーザーのタグの取得
+ ユーザーグループの取得
+ スタンプ情報の取得
+ 自分のスタンプ履歴の取得
+ お気に入りスタンプの取得
+ ファイルのダウンロード
+ オンライン状態の取得
+ Webhook情報の取得
+ Bot情報の取得

#### 書き込み

+ チャンネルの作成
+ チャンネルトピックの変更
+ メッセージの投稿/編集/削除/通報
+ メッセージのピン留め/ピン留めの解除
+ チャンネル購読の変更
+ 通知デバイスの登録
+ 自ユーザー情報/アイコンの変更
+ クリップの作成/削除
+ クリップフォルダーの作成/変更/削除
+ スター(お気に入り)チャンネルの変更
+ メッセージの既読化
+ ミュートチャンネルの変更
+ ユーザーのタグの変更
+ ユーザーグループの作成/編集/削除
+ スタンプの作成
+ メッセージへのスタンプの追加/削除
+ 自分の作成したスタンプの画像の変更
+ お気に入りスタンプの変更
+ ファイルのアップロード
+ オンライン状態の更新
+ Botのインストール/アンインストール

#### BOT管理

+ チャンネル情報の取得
+ ユーザー情報の取得
+ 自ユーザー情報の取得
+ Webhookの情報の取得
+ Webhookの作成/変更/削除
+ BOTの情報の取得
+ BOTの作成/変更/削除
+ BOTのインストール/アンインストール
+ Clientの情報の取得
+ Clientの作成/編集/削除

#### 備考

各権限で行えることの最新情報は以下のソースを参照してください。

+ [ユーザー識別子(openid)](https://github.com/traPtitech/traQ/blob/master/service/rbac/role/openid.go)
+ [プロフィール情報(profile)](https://github.com/traPtitech/traQ/blob/master/service/rbac/role/profile.go)
+ [読み取り(read)](https://github.com/traPtitech/traQ/blob/master/service/rbac/role/read.go)
+ [書き込み(write)](https://github.com/traPtitech/traQ/blob/master/service/rbac/role/write.go)
+ [BOT管理(manage_bot)](https://github.com/traPtitech/traQ/blob/master/service/rbac/role/manage_bot.go)
