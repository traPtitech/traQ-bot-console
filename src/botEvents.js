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
  }
}
