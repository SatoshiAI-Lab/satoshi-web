import React from 'react'

import { DataType } from '@/stores/use-chat-store/types'
import { ExchangeAnnBubble } from './exchange-announcement-bubble'
import { NewPoolBubble } from './new-pool-bubble'
import { NewsBubble } from './news-bubble'
import { TwitterBubble } from './twitter-bubble'
import { WalletBubble } from './wallet-bubble'
import { useMessagesContext } from '@/contexts/messages'
import { MessageMatchError } from '@/components/errors/message-match'

export const MonitorMessages = () => {
  const {
    message: { data_type },
  } = useMessagesContext()

  if (data_type === DataType.NewsInfo) return <NewsBubble />

  if (data_type === DataType.AnnInfo) return <ExchangeAnnBubble />

  if (data_type === DataType.TradeInfo) return <WalletBubble />

  if (data_type === DataType.TwitterInfo) return <TwitterBubble />

  if (data_type === DataType.PoolInfo) return <NewPoolBubble />

  return <MessageMatchError reasonComponent={MonitorMessages} />
}
