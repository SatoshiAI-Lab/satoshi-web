import React, { memo } from 'react'

import { type Message } from '@/stores/use-chat-store/types'

import { MessageBubble } from './message-bubble'
import { InteractiveMessage } from './interactive-message/interactive-message'
import { TokenMarkdown } from '@/components/token-markdown'
import { IntentMessage } from './intention-message/intention-message'
import { MonitorConfigBubble } from './monitor-message/monitor-config-bubble'
import { PrivateKeyMessage } from './private-key-message'

import LoadingMessage from './loading-message'

interface Props {
  messages: Message[]
}

const Messages = memo((props: Props) => {
  return props.messages.map((msg, i) => {
    if (msg.isLoading) {
      return <LoadingMessage key={i} />
    }

    if (msg?.isMonitor) {
      return <MonitorConfigBubble key={i} msg={msg} />
    }

    if (msg?.isIntention) {
      return <IntentMessage key={i} msg={msg!} />
    }

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
