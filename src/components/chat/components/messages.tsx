import React, { memo } from 'react'

import { type Message } from '@/stores/use-chat-store/types'

import { MessageBubble } from './message-bubble'
import { InteractiveMessage } from './interactive-message/interactive-message'
import { TokenMarkdown } from '@/components/token-markdown'
import { IntentionMessage } from './intention-message/intention-message'
import { MonitorMessages } from './monitor-message/monitor-config-bubble'
import { PrivateKeyMessage } from './private-key-message'
import { LoadingMessage } from './loading-message'

interface Props {
  messages: Message[]
}

const Messages = memo((props: Props) => {
  return props.messages.map((msg, i) => {
    // Is loading message.
    if (msg.isLoading) {
      return <LoadingMessage key={i} />
    }

    // Monitor message category.
    if (msg?.isMonitor) {
      return <MonitorMessages key={i} msg={msg} />
    }

    // Intention message category.
    if (msg?.isIntention) {
      return <IntentionMessage key={i} msg={msg!} />
    }

    // Interactive message category.
    if (msg?.isInteractive) {
      return <InteractiveMessage key={i} message={msg} />
    }

    const privKeyData = msg.meta?.data as unknown as {
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
      <MessageBubble key={i} role={msg.role}>
        <TokenMarkdown children={msg.text} {...props} />
      </MessageBubble>
    )
  })
})

export default Messages
