import React from 'react'
import { isEmpty } from 'lodash'

import { MessageBubble } from '../../message-bubble'
import { useMessagesContext } from '@/contexts/messages'
import { MetaType, MetaTypeData } from '@/api/chat/types'

export const WalletCreateMessage = () => {
  const { message } = useMessagesContext()
  const { chain_name } = message.meta
    ?.data as MetaTypeData[MetaType.WalletCreate]

  // `chain_name` is empty, let user choose a chain.
  if (isEmpty(chain_name)) {
  }

  return (
    <MessageBubble>
      <p>WalletCreateMessage</p>
    </MessageBubble>
  )
}

export default WalletCreateMessage
