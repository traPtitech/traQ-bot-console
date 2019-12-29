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
  MENTION_MESSAGE_CREATED: {
    category: 'メッセージ',
    description:
      'BOTに対してメンションされた。このイベントはMESSAGE_CREATEDとして配信されます。'
  },
  DIRECT_MESSAGE_CREATED: {
    category: 'メッセージ',
    description: 'BOTに対してダイレクトメッセージが投稿された'
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
  }
}
