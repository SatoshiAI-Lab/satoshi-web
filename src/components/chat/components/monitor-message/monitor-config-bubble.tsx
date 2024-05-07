import React from 'react'

import { ExchangeAnnBubble } from './exchange-announcement-bubble'
import { NewPoolBubble } from './new-pool-bubble'
import { NewsBubble } from './news-bubble'
import { TwitterBubble } from './twitter-bubble'
import { WalletBubble } from './wallet-bubble'
import { useMessagesContext } from '@/contexts/messages'
import { MessageMatchError } from '@/components/errors/message-match'

export const MonitorMessages = () => {
  const { dataType } = useMessagesContext()

  if (dataType.isMonitorNews) return <NewsBubble />

  if (dataType.isMonitorAnn) return <ExchangeAnnBubble />

  if (dataType.isMonitorTrade) return <WalletBubble />

  if (dataType.isMonitorTwitter) return <TwitterBubble />

  if (dataType.isMonitorNewPool) return <NewPoolBubble />

  return <MessageMatchError reasonComponent={MonitorMessages} />
}
