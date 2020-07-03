# BOTイベントリファレンス(チャンネル)

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
