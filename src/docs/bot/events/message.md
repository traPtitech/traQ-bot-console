# BOTイベントリファレンス(メッセージ)

## MESSAGE_CREATED
チャンネルにメッセージが投稿された

### サンプル
```json
{
  "eventTime": "2019-05-08T13:33:51.690308239Z",
  "message": {
    "id": "bc9106b3-f9b2-4eca-9ba1-72b39b40954e",
    "user": {
      "id": "dfdff0c9-5de0-46ee-9721-2525e8bb3d45",
      "name": "takashi_trap",
      "displayName": "寺田 健二",
      "iconId": "2bc06cda-bdb9-4a68-8000-62f907f36a92",
      "bot": false
    },
    "channelId": "9aba50da-f605-4cd0-a428-5e4558cb911e",
    "text": "!{\"type\": \"user\", \"raw\": \"@takashi_trap\", \"id\": \"dfdff0c9-5de0-46ee-9721-2525e8bb3d45\"} こんにちは",
    "plainText": "@takashi_trap こんにちは",
    "embedded": [
      {
        "raw": "@takashi_trap",
        "type": "user",
        "id": "dfdff0c9-5de0-46ee-9721-2525e8bb3d45"
      }
    ],
    "createdAt": "2019-05-08T13:33:51.632149265Z",
    "updatedAt": "2019-05-08T13:33:51.632149265Z"
  }
}
```

## MESSAGE_DELETED
チャンネルのメッセージが削除された

### サンプル
```json
{
  "eventTime": "2019-05-08T13:33:51.690308239Z",
  "message": {
    "id": "bc9106b3-f9b2-4eca-9ba1-72b39b40954e",
    "channelId": "9aba50da-f605-4cd0-a428-5e4558cb911e"
  }
}
```

## MESSAGE_UPDATED
チャンネルのメッセージが編集された

### サンプル
```json
{
  "eventTime": "2019-05-08T13:33:51.690308239Z",
  "message": {
    "id": "bc9106b3-f9b2-4eca-9ba1-72b39b40954e",
    "user": {
      "id": "dfdff0c9-5de0-46ee-9721-2525e8bb3d45",
      "name": "takashi_trap",
      "displayName": "寺田 健二",
      "iconId": "2bc06cda-bdb9-4a68-8000-62f907f36a92",
      "bot": false
    },
    "channelId": "9aba50da-f605-4cd0-a428-5e4558cb911e",
    "text": "!{\"type\": \"user\", \"raw\": \"@takashi_trap\", \"id\": \"dfdff0c9-5de0-46ee-9721-2525e8bb3d45\"} こんにちは",
    "plainText": "@takashi_trap こんにちは",
    "embedded": [
      {
        "raw": "@takashi_trap",
        "type": "user",
        "id": "dfdff0c9-5de0-46ee-9721-2525e8bb3d45"
      }
    ],
    "createdAt": "2019-05-08T13:33:51.632149265Z",
    "updatedAt": "2019-05-08T13:33:51.632149265Z"
  }
}
```

## DIRECT_MESSAGE_CREATED
BOTに対してダイレクトメッセージが投稿された

### サンプル
```json
{
  "eventTime": "2019-05-08T13:36:09.421492525Z",
  "message": {
    "id": "2d7ff3f5-c313-4f4a-a9bb-0b5f84d2b6f8",
    "user": {
      "id": "dfdff0c9-5de0-46ee-9721-2525e8bb3d45",
      "name": "takashi_trap",
      "displayName": "寺田 健二",
      "iconId": "2bc06cda-bdb9-4a68-8000-62f907f36a92",
      "bot": false
    },
    "channelId": "c5a5a697-3bad-4540-b2da-93dc88181d34",
    "text": "!{\"type\": \"user\", \"raw\": \"@takashi_trap\", \"id\": \"dfdff0c9-5de0-46ee-9721-2525e8bb3d45\"} こんにちは",
    "plainText": "@takashi_trap こんにちは",
    "embedded": [
      {
        "raw": "@takashi_trap",
        "type": "user",
        "id": "dfdff0c9-5de0-46ee-9721-2525e8bb3d45"
      }
    ],
    "createdAt": "2019-05-08T13:36:09.365393261Z",
    "updatedAt": "2019-05-08T13:36:09.365393261Z"
  }
}
```

## DIRECT_MESSAGE_DELETED
BOTに対してのダイレクトメッセージが削除された

### サンプル
```json
{
  "eventTime": "2019-05-08T13:36:09.421492525Z",
  "message": {
    "id": "2d7ff3f5-c313-4f4a-a9bb-0b5f84d2b6f8",
    "userId": "dfdff0c9-5de0-46ee-9721-2525e8bb3d45",
    "channelId": "c5a5a697-3bad-4540-b2da-93dc88181d34"
  }
}
```

## DIRECT_MESSAGE_UPDATED
BOTに対してのダイレクトメッセージが編集された

### サンプル
```json
{
  "eventTime": "2019-05-08T13:36:09.421492525Z",
  "message": {
    "id": "2d7ff3f5-c313-4f4a-a9bb-0b5f84d2b6f8",
    "user": {
      "id": "dfdff0c9-5de0-46ee-9721-2525e8bb3d45",
      "name": "takashi_trap",
      "displayName": "寺田 健二",
      "iconId": "2bc06cda-bdb9-4a68-8000-62f907f36a92",
      "bot": false
    },
    "channelId": "c5a5a697-3bad-4540-b2da-93dc88181d34",
    "text": "!{\"type\": \"user\", \"raw\": \"@takashi_trap\", \"id\": \"dfdff0c9-5de0-46ee-9721-2525e8bb3d45\"} こんにちは",
    "plainText": "@takashi_trap こんにちは",
    "embedded": [
      {
        "raw": "@takashi_trap",
        "type": "user",
        "id": "dfdff0c9-5de0-46ee-9721-2525e8bb3d45"
      }
    ],
    "createdAt": "2019-05-08T13:36:09.365393261Z",
    "updatedAt": "2019-05-08T13:36:09.365393261Z"
  }
}
```
