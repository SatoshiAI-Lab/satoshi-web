import React, { memo } from 'react'
import { AiOutlineLoading } from 'react-icons/ai'

import MessageBubble from './bubbles/message-bubble'
import InteractiveMessage from './interactive-message'
import MarkdownParser from '@/components/markdown-parser'
import { useTranslation } from 'react-i18next'

import { DataType, type Message } from '@/stores/use-chat-store/types'
import { IntentMessage } from './intention-message'
import {
  ChatResponseMetaAnnounceMent,
  ChatResponseMetaNewsInfo,
  ChatResponseMetaTwitter,
  ChatResponseMetaWallet,
} from '@/api/chat/types'
import NewsBubble from './bubbles/news-bubble'
import ExchangeAnnouncementBubble from './bubbles/exchange-announcement-bubble'
import WalletBubble from './bubbles/wallet-bubble'
import TwitterBubble from './bubbles/twitter-bubble'

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

    if (msg.data_type === DataType.NewsInfo) {
      return (
        <NewsBubble key={i} {...(msg as unknown as ChatResponseMetaNewsInfo)} />
      )
    }

    if (msg.data_type === DataType.AnnouncementInfo) {
      return (
        <ExchangeAnnouncementBubble
          key={i}
          {...(msg as unknown as ChatResponseMetaAnnounceMent)}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: (msg as unknown as ChatResponseMetaAnnounceMent).content
                .en,
            }}
          ></div>
        </ExchangeAnnouncementBubble>
      )
    }

    if (msg.data_type === DataType.TradeInfo) {
      return (
        <WalletBubble key={i} {...(msg as unknown as ChatResponseMetaWallet)} />
      )
    }

    if (msg.data_type === DataType.TwitterInfo) {
      return (
        <TwitterBubble
          key={i}
          {...(msg as unknown as ChatResponseMetaTwitter)}
        />
      )
    }

    if (msg.isInteractive) {
      return <InteractiveMessage key={i} msgs={msg.msgs!} />
    }

    if (msg.isIntention) {
      return <IntentMessage key={i} msg={msg!}></IntentMessage>
    }

    return (
      <MessageBubble key={i} position={msg.position} className={className}>
        <MarkdownParser children={msg.msg} {...props} />
      </MessageBubble>
    )
  })
})

export default Messages
