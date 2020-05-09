# BOTイベントリファレンス

## PING
疎通確認イベント

### サンプル
```json
{
  "eventTime": "2019-05-07T04:50:48.582586882Z"
}
```

## JOINED
BOTがチャンネルに参加した

### サンプル
```json
{
  "eventTime": "2019-05-08T13:49:13.769110201Z",
  "channel": {
    "id": "f86c925c-3002-4ba5-939a-c92344e534f9",
    "name": "po",
    "path": "#a/po",
    "parentId": "ea452867-553b-4808-a14f-a47ee0009ee6",
    "creator": {
      "id": "dfdff0c9-5de0-46ee-9721-2525e8bb3d45",
      "name": "takashi_trap",
      "displayName": "寺田 健二",
      "iconId": "2bc06cda-bdb9-4a68-8000-62f907f36a92",
      "bot": false
    },
    "createdAt": "2018-04-25T12:22:02Z",
    "updatedAt": "2018-04-25T12:22:02Z"
  }
}
```

## LEFT
BOTがチャンネルから退出した

### サンプル
```json
{
  "eventTime": "2019-05-08T13:49:16.497848449Z",
  "channel": {
    "id": "f86c925c-3002-4ba5-939a-c92344e534f9",
    "name": "po",
    "path": "#a/po",
    "parentId": "ea452867-553b-4808-a14f-a47ee0009ee6",
    "creator": {
      "id": "dfdff0c9-5de0-46ee-9721-2525e8bb3d45",
      "name": "takashi_trap",
      "displayName": "寺田 健二",
      "iconId": "2bc06cda-bdb9-4a68-8000-62f907f36a92",
      "bot": false
    },
    "createdAt": "2018-04-25T12:22:02Z",
    "updatedAt": "2018-04-25T12:22:02Z"
  }
}
```

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

## CHANNEL_CREATED
チャンネルが作成された

### サンプル
```json
{
  "eventTime": "2019-05-08T13:45:51.506206852Z",
  "channel": {
    "id": "711afb4c-23e7-46dc-b845-5160f7088ce9",
    "name": "yamada",
    "path": "#gps/yamada",
    "parentId": "ea452867-553b-4808-a14f-a47ee0009ee6",
    "creator": {
      "id": "dfdff0c9-5de0-46ee-9721-2525e8bb3d45",
      "name": "takashi_trap",
      "displayName": "寺田 健二",
      "iconId": "2bc06cda-bdb9-4a68-8000-62f907f36a92",
      "bot": false
    },
    "createdAt": "2019-05-08T13:45:51.487718Z",
    "updatedAt": "2019-05-08T13:45:51.487718Z"
  }
}
```

## CHANNEL_TOPIC_CHANGED
チャンネルのトピックが変更された

### サンプル
```json
{
  "eventTime": "2019-05-09T11:32:49.505357701Z",
  "channel": {
    "id": "9aba50da-f605-4cd0-a428-5e4558cb911e",
    "name": "bot",
    "path": "#a/bot",
    "parentId": "ea452867-553b-4808-a14f-a47ee0009ee6",
    "creator": {
      "id": "dfdff0c9-5de0-46ee-9721-2525e8bb3d45",
      "name": "takashi_trap",
      "displayName": "寺田 健二",
      "iconId": "2bc06cda-bdb9-4a68-8000-62f907f36a92",
      "bot": false
    },
    "createdAt": "2019-04-02T06:31:16.229419Z",
    "updatedAt": "2019-05-09T11:32:49.475127Z"
  },
  "topic": "トピック",
  "updater": {
    "id": "dfdff0c9-5de0-46ee-9721-2525e8bb3d45",
    "name": "takashi_trap",
    "displayName": "寺田 健二",
    "iconId": "2bc06cda-bdb9-4a68-8000-62f907f36a92",
    "bot": false
  }
}
```

## USER_CREATED
ユーザーが作成された

### サンプル
```json
{
  "eventTime": "2019-05-08T08:31:06.566228282Z",
  "user": {
    "id": "dfdff0c9-5de0-46ee-9721-2525e8bb3d45",
    "name": "takashi_trap",
    "displayName": "",
    "iconId": "2bc06cda-bdb9-4a68-8000-62f907f36a92",
    "bot": false
  }
}
```

## STAMP_CREATED
スタンプが作成された

### サンプル
```json
{
  "eventTime": "2019-05-08T08:31:06.566228282Z",
  "id": "2bc06cda-bdb9-4a68-8000-62f907f36a92",
  "name": "naruhodo",
  "fileId": "2bc06cda-bdb9-4a68-8000-62f907f36a92",
  "creator": {
    "id": "dfdff0c9-5de0-46ee-9721-2525e8bb3d45",
    "name": "takashi_trap",
    "displayName": "",
    "iconId": "2bc06cda-bdb9-4a68-8000-62f907f36a92",
    "bot": false
  }
}
```

## TAG_ADDED
BOTにタグが追加された

### サンプル
```json
{
  "eventTime": "2019-05-08T08:31:06.566228282Z",
  "tagId": "2bc06cda-bdb9-4a68-8000-62f907f36a92",
  "tag": "全強"
}
```

## TAG_REMOVED
BOTからタグが削除された

### サンプル
```json
{
  "eventTime": "2019-05-08T08:31:06.566228282Z",
  "tagId": "2bc06cda-bdb9-4a68-8000-62f907f36a92",
  "tag": "全強"
}
```
