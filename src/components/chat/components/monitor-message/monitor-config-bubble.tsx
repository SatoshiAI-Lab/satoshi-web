import React, { useContext } from 'react'

import type {
  ChatResponseMetaNewsInfo,
  ChatResponseMetaAnnounceMent,
  ChatResponseMetaWallet,
  ChatResponseMetaTwitter,
  ChatResponseMetaNewPoolV2,
} from '@/api/chat/types'
import { DataType } from '@/stores/use-chat-store/types'

import ExchangeAnnouncementBubble from './exchange-announcement-bubble'
import NewPoolBubble from './new-pool-bubble'
import NewsBubble from './news-bubble'
import TwitterBubble from './twitter-bubble'
import WalletBubble from './wallet-bubble'
import { MessagesContext } from '@/contexts/messages'

export const MonitorMessages = () => {
  const { message: msg } = useContext(MessagesContext)!

  if (msg.data_type === DataType.NewsInfo) {
    return <NewsBubble data={msg as unknown as ChatResponseMetaNewsInfo} />
  }

  if (msg.data_type === DataType.AnnouncementInfo) {
    return (
      <ExchangeAnnouncementBubble
        data={msg as unknown as ChatResponseMetaAnnounceMent}
      />
    )
  }

  if (msg.data_type === DataType.TradeInfo) {
    return <WalletBubble data={msg as unknown as ChatResponseMetaWallet} />
  }

  if (msg.data_type === DataType.TwitterInfo) {
    return <TwitterBubble data={msg as unknown as ChatResponseMetaTwitter} />
  }

  if (msg.data_type === DataType.PoolInfo) {
    return (
      <NewPoolBubble
        {...{ ...(msg as unknown as ChatResponseMetaNewPoolV2) }}
      />
    )
  }
}
