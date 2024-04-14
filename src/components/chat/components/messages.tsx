import React, { memo } from 'react'
import { AiOutlineLoading } from 'react-icons/ai'

import MessageBubble from './bubbles/message-bubble'
import InteractiveMessage from './interactive-message'
import MarkdownParser from '@/components/markdown-parser'
import { useTranslation } from 'react-i18next'
import { IntentMessage } from './intention-message/intention-message'
import { MonitorConfigBubble } from './monitor-message/monitor-config-bubble'
import { PrivateKeyMessage } from './private-key-message'

import { type Message } from '@/stores/use-chat-store/types'

interface MessagesProps {
  messages: Message[]
  className?: string
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

// Cache component, only update when props change.
const Messages = memo((props: MessagesProps) => {
  const { messages, className = '' } = props
  const { t } = useTranslation()

  return messages.map((msg, i) => {
    if (msg.isLoadingMsg) {
      return (
        <MessageBubble key={i} className={`flex items-center ${className}`}>
          {t('thinking')}
          <AiOutlineLoading className="animate-spin fill-blue-600 ml-2" />
        </MessageBubble>
      )
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

    const privKeyData = msg.msgs?.data as unknown as { private_key?: string }
    const privateKey = privKeyData?.private_key
    if (privateKey) {
      return <PrivateKeyMessage privateKey={privateKey} />
    }

    return (
      <MessageBubble key={i} position={msg.position} className={className}>
        <MarkdownParser children={msg.msg} {...props} />
      </MessageBubble>
    )
  })
})

export default Messages
