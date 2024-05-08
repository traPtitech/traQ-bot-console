# traQ OAuth Client 概要

traQではOAuth 2.0とOIDCが実装されています。  
OAuth 2.0に存在する4つの認可フローのうち、Authorization Code Flowのみ利用することが可能です。

## Clientの登録

認証で利用する設定や利用する権限の指定をします。   
後からの権限の変更はできないので注意してください。  
詳細は[Clientを新規登録する](/docs/client/create)を参照してください。

## Clientページの作成

traQへのアクセスを許可するかどうかのページへ遷移したり、
許可されたあとに実際にトークンを取得する処理をします。  
詳細は[Clientページを作成する](/docs/client/page)を参照してください。  
一般的なOAuthクライアントの利用も可能です。  
