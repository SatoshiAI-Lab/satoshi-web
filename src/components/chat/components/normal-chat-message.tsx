import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

import { MessageBubble } from './message-bubble'
import { useMessagesContext } from '@/contexts/messages'

export const NormalChatMessage = () => {
  const { message } = useMessagesContext()

  return (
    <MessageBubble>
      <ReactMarkdown
        // `remarkMath` may cause market rendering to be repeated
        remarkPlugins={[remarkGfm]} // GFM: GitHub Flavored Markdown
        // @ts-ignore
        rehypePlugins={[rehypeRaw]} // When encountering custom tags like <reference>, probbly parsing failed.
        children={message.text}
      />
    </MessageBubble>
  )
}

export default NormalChatMessage
