# BOTイベントリファレンス(ユーザーグループ)

## USER_GROUP_CREATED
ユーザーグループが作成された

### サンプル
```json
{
  "eventTime": "2023-08-25T04:04:32.912312Z",
  "group": {
    "id": "f265bde2-04cc-4856-9008-3db1d953a539",
    "name": "fugafuga",
    "description": "FUGA_FUGA",
    "type": "ふがふが",
    "icon": "81f6da0d-eaab-4c42-84ac-74f5111e1eaa",
    "admins": [
      {
        "groupId": "f265bde2-04cc-4856-9008-3db1d953a539",
        "userId": "8e6a088f-9274-42c0-bb20-cee7913d144b"
      }
    ],
    "members": [
      {
        "groupId": "f265bde2-04cc-4856-9008-3db1d953a539",
        "userId": "8e6a088f-9274-42c0-bb20-cee7913d144b",
        "role": ""
      }
    ],
    "createdAt": "2023-08-25T04:04:32.912312Z",
    "updatedAt": "2023-08-25T04:04:32.912312Z"
  }
}
```

## USER_GROUP_UPDATED
ユーザーグループが更新された

### サンプル
```json
{
  "eventTime": "2023-08-25T04:04:32.962264Z",
  "groupId": "f265bde2-04cc-4856-9008-3db1d953a539"
}
```

## USER_GROUP_DELETED
ユーザーグループが削除された

### サンプル
```json
{
  "eventTime": "2023-08-25T06:40:35.971142Z",
  "groupId": "f265bde2-04cc-4856-9008-3db1d953a539"
}
```

## USER_GROUP_MEMBER_ADDED
ユーザーグループにメンバーが追加された

### サンプル
```json
{
  "eventTime": "2023-08-25T04:04:32.962264Z",
  "groupMember": {
    "groupId": "f265bde2-04cc-4856-9008-3db1d953a539",
    "userId": "8e6a088f-9274-42c0-bb20-cee7913d144b"
  }
}
```

## USER_GROUP_MEMBER_UPDATED
ユーザーグループのメンバー情報が更新された

### サンプル
```json
{
  "eventTime": "2023-08-25T04:04:32.962264Z",
  "groupMember": {
    "groupId": "f265bde2-04cc-4856-9008-3db1d953a539",
    "userId": "8e6a088f-9274-42c0-bb20-cee7913d144b"
  }
}
```

## USER_GROUP_MEMBER_REMOVED
ユーザーグループのメンバーが削除された

### サンプル
```json
{
  "eventTime": "2023-08-25T04:04:32.962264Z",
  "groupMember": {
    "groupId": "f265bde2-04cc-4856-9008-3db1d953a539",
    "userId": "8e6a088f-9274-42c0-bb20-cee7913d144b"
  }
}
```

## USER_GROUP_ADMIN_ADDED
ユーザーグループに管理者が追加された

### サンプル
```json
{
  "eventTime": "2023-08-25T04:04:32.962264Z",
  "groupMember": {
    "groupId": "f265bde2-04cc-4856-9008-3db1d953a539",
    "userId": "8e6a088f-9274-42c0-bb20-cee7913d144b"
  }
}
```

## USER_GROUP_ADMIN_REMOVED
ユーザーグループの管理者が削除された

### サンプル
```json
{
  "eventTime": "2023-08-25T04:04:32.962264Z",
  "groupMember": {
    "groupId": "f265bde2-04cc-4856-9008-3db1d953a539",
    "userId": "8e6a088f-9274-42c0-bb20-cee7913d144b"
  }
}
```
