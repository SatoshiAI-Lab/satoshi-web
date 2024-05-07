import React from 'react'

import { MessageBubble } from './message-bubble'
import { TokenMarkdown } from '@/components/token-markdown'
import { useMessagesContext } from '@/contexts/messages'
import { useHypertext } from '@/hooks/use-hypertext'
import { InteractiveMessage } from './interactive-message'

export const TokenMessages = () => {
  const { message, answerType } = useMessagesContext()
  const parseHypertext = useHypertext()
  const hypertext = parseHypertext(message.hyper_text).trim() + '\n\n'

  if (answerType.isInteractive) return <InteractiveMessage />

  if (answerType.isReference) {
    console.log('isRef:', message)
    return
  }

  return (
    <MessageBubble>
      <TokenMarkdown children={hypertext + message.text} />
    </MessageBubble>
  )
}

export default TokenMessages
