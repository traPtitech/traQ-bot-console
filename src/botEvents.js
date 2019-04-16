export default {
  'PING': {
    category: 'システム',
    description: '疎通確認イベント',
    always: true
  },
  'JOINED': {
    category: 'システム',
    description: 'BOTがチャンネルに参加した',
    always: true
  },
  'LEFT': {
    category: 'システム',
    description: 'BOTがチャンネルから退出した',
    always: true
  },
  'MESSAGE_CREATED': {
    category: 'メッセージ',
    description: 'チャンネルにメッセージが投稿された'
  },
  'CHANNEL_CREATED': {
    category: 'チャンネル',
    description: 'チャンネルが作成された',
    privileged: true
  },
  'USER_CREATED': {
    category: 'ユーザー',
    description: 'ユーザーが作成された',
    privileged: true
  }
}
