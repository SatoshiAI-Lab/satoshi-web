import React, { memo } from 'react'

import { type Message } from '@/stores/use-chat-store/types'

import MessageBubble from './message-bubble'
import InteractiveMessage from './interactive-message'
import TokenMarkdown from '@/components/token-markdown'
import { IntentMessage } from './intention-message/intention-message'
import { MonitorConfigBubble } from './monitor-message/monitor-config-bubble'
import { PrivateKeyMessage } from './private-key-message'

import LoadingMessage from './loading-message'

interface Props {
  messages: Message[]
}

// Cache component, only update when props change.
const Messages = memo((props: Props) => {
  return props.messages.map((msg, i) => {
    if (msg.isLoadingMsg) {
      return <LoadingMessage key={i} />
    }

    if (msg.isMonitor) {
      return <MonitorConfigBubble key={i} msg={msg} />
    }

    if (msg.isIntention) {
      return <IntentMessage key={i} msg={msg!}></IntentMessage>
    }

    if (msg.isInteractive) {
      return <InteractiveMessage key={i} msgs={msg.msgs!} />
    }

    const privKeyData = msg.msgs?.data as unknown as {
      private_key?: string
      wallet_name?: string
    }
    const privateKey = privKeyData?.private_key
    if (privateKey) {
      return (
        <PrivateKeyMessage
          name={privKeyData.wallet_name ?? ''}
          privateKey={privateKey}
        />
      )
    }

    return (
      <MessageBubble key={i} position={msg.position}>
        <TokenMarkdown children={msg.msg} {...props} />
      </MessageBubble>
    )
  })
})

export default Messages
