import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { BsChevronRight } from 'react-icons/bs'
import { Divider } from '@mui/material'
import { clsx } from 'clsx'

import type {
  ChatMeta,
  ChatResponseAnswerMetaCoin,
  ChatResponseMetaLabel,
} from '@/api/chat/types'

import { MessageBubble } from '../message-bubble'
import { useChat } from '@/hooks/use-chat'
import { useMessages } from '@/hooks/use-messages'
import { useMessagesContext } from '@/contexts/messages'
import { useChatStore } from '@/stores/use-chat-store'

interface SingleMessageProps {
  id?: string
  meta?: ChatResponseAnswerMetaCoin[] | ChatResponseMetaLabel[]
  type?: keyof ChatMeta
  classes?: string
  title?: string
  onClick?: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    msg: ChatResponseAnswerMetaCoin
  ) => void
}

let selectedMeta: ChatResponseAnswerMetaCoin | undefined

export const SingleMessage = (props: SingleMessageProps) => {
  const { meta = [], title } = props
  const messageRef = useRef<HTMLDivElement>(null)
  const { sendChat } = useMessagesContext()
  const { findPrevMessage } = useChatStore()

  const formatMsg = (msg: ChatResponseAnswerMetaCoin) => {
    const { alias, name } = msg

    if (!alias || !Array.isArray(alias)) {
      return name
    }

    const uniqueAlias = alias.filter((a) => a !== name)
    const result = uniqueAlias.length ? ` (${uniqueAlias.join('、')})` : ''

    return name + result
  }

  const onClickToken = () => {
    if (!selectedMeta || !messageRef.current) return

    const id = messageRef.current.dataset.messageId
    const message = findPrevMessage(id ?? '')

    if (!message) {
      console.error('Cannot find previous message')
      return
    }

    sendChat({
      id: selectedMeta.id,
      type: selectedMeta.type,
      name: selectedMeta.name,
      question: message.text,
    })
    // Clear when clicked.
    selectedMeta = undefined
  }

  if (!meta.length) return <></>

  return (
    <MessageBubble ref={messageRef} onClick={onClickToken}>
      <p className="font-bold mb-1">{title}</p>
      {meta.map((msg, i) => (
        <React.Fragment key={i}>
          <div
            className={clsx(
              'flex items-center justify-between cursor-pointer',
              'hover:text-primary transition-all'
            )}
            onClick={() => (selectedMeta = msg)}
          >
            <span className="mr-5">{formatMsg(msg)}</span>
            <BsChevronRight className="shrink-0" />
          </div>
          {meta.length - 1 !== i && (
            <Divider className="!my-2 !border-[#c9c9c9]" />
          )}
        </React.Fragment>
      ))}
    </MessageBubble>
  )
}

export default SingleMessage
