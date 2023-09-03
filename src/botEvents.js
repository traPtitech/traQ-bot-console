export default {
  PING: {
    category: 'システム',
    description: '疎通確認イベント',
    always: true
  },
  JOINED: {
    category: 'システム',
    description: 'BOTがチャンネルに参加した',
    always: true
  },
  LEFT: {
    category: 'システム',
    description: 'BOTがチャンネルから退出した',
    always: true
  },
  MESSAGE_CREATED: {
    category: 'メッセージ',
    description:
      'チャンネルにメッセージが投稿された。このイベントは参加チャンネルに投稿されたメンションを含みます。'
  },
  MESSAGE_DELETED: {
    category: 'メッセージ',
    description: 'チャンネルのメッセージが削除された'
  },
  MESSAGE_UPDATED: {
    category: 'メッセージ',
    description: 'チャンネルのメッセージが編集された'
  },
  MENTION_MESSAGE_CREATED: {
    category: 'メッセージ',
    description:
      'BOTに対してメンションされた。このイベントはMESSAGE_CREATEDとして配信されます。'
  },
  BOT_MESSAGE_STAMPS_UPDATED: {
    category: 'メッセージ',
    description:
      'BOTが投稿したメッセージに押されているスタンプが変化した。このイベントは１秒間スロットリングされます。'
  },
  DIRECT_MESSAGE_CREATED: {
    category: 'メッセージ',
    description: 'BOTに対してダイレクトメッセージが投稿された'
  },
  DIRECT_MESSAGE_DELETED: {
    category: 'メッセージ',
    description: 'BOTに対してのダイレクトメッセージが削除された'
  },
  DIRECT_MESSAGE_UPDATED: {
    category: 'メッセージ',
    description: 'BOTに対してのダイレクトメッセージが編集された'
  },
  CHANNEL_CREATED: {
    category: 'チャンネル',
    description: 'チャンネルが作成された',
    privileged: true
  },
  CHANNEL_TOPIC_CHANGED: {
    category: 'チャンネル',
    description: 'チャンネルのトピックが変更された'
  },
  USER_CREATED: {
    category: 'ユーザー',
    description: 'ユーザーが作成された',
    privileged: true
  },
  STAMP_CREATED: {
    category: 'スタンプ',
    description: 'スタンプが作成された'
  },
  TAG_ADDED: {
    category: 'タグ',
    description: 'BOTにタグが追加された'
  },
  TAG_REMOVED: {
    category: 'タグ',
    description: 'BOTからタグが削除された'
  },
  USER_GROUP_CREATED: {
    category: 'ユーザーグループ',
    description: 'ユーザーグループが作成された'
  },
  USER_GROUP_UPDATED: {
    category: 'ユーザーグループ',
    description: 'ユーザーグループが更新された'
  },
  USER_GROUP_DELETED: {
    category: 'ユーザーグループ',
    description: 'ユーザーグループが削除された'
  },
  USER_GROUP_MEMBER_ADDED: {
    category: 'ユーザーグループ',
    description: 'ユーザーグループにメンバーが追加された'
  },
  USER_GROUP_MEMBER_UPDATED: {
    category: 'ユーザーグループ',
    description: 'ユーザーグループのメンバー情報が更新された'
  },
  USER_GROUP_MEMBER_REMOVED: {
    category: 'ユーザーグループ',
    description: 'ユーザーグループのメンバーが削除された'
  },
  USER_GROUP_ADMIN_ADDED: {
    category: 'ユーザーグループ',
    description: 'ユーザーグループに管理者が追加された'
  },
  USER_GROUP_ADMIN_REMOVED: {
    category: 'ユーザーグループ',
    description: 'ユーザーグループの管理者が削除された'
  }
}
