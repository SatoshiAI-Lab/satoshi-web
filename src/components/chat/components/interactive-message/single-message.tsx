import React from 'react'
import { useTranslation } from 'react-i18next'
import { BsChevronRight } from 'react-icons/bs'
import { Divider } from '@mui/material'
import { clsx } from 'clsx'
import { toast } from 'react-hot-toast'

import type {
  ChatMeta,
  ChatResponseAnswerMetaCoin,
  ChatResponseMetaLabel,
} from '@/api/chat/types'

import { MessageBubble } from '../message-bubble'
import { utilDom } from '@/utils/dom'
import { useChat } from '@/hooks/use-chat'
import { useMessages } from '@/hooks/use-messages'

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

export const SingleMessage = (props: SingleMessageProps) => {
  const [t] = useTranslation()
  const { meta = [], title, id } = props
  const { findPrevInteractive } = useMessages()
  const { isLoading, sendChat } = useChat()

  const formatMsg = (msg: ChatResponseAnswerMetaCoin) => {
    const { alias, name } = msg

    if (!alias || !Array.isArray(alias)) {
      return name
    }

    const uniqueAlias = alias.filter((a) => a !== name)
    const result = uniqueAlias.length ? `（${uniqueAlias.join('、')}）` : ''

    return name + result
  }

  const onClick = async (
    e: React.MouseEvent<HTMLDivElement>,
    msg: ChatResponseAnswerMetaCoin
  ) => {
    if (isLoading) {
      toast.error(t('chat.asking'))
      return
    }

    const { targetEl } = utilDom.eventProxy(e.target as HTMLElement, 'div')
    const tokenName = targetEl.firstChild?.textContent ?? ''
    const prevMessage = findPrevInteractive(id) ?? { text: msg.name }
    const interactiveOps = {
      id: msg.id,
      type: msg.type,
      name: tokenName,
      question: prevMessage.text,
    }

    sendChat(interactiveOps)
  }

  if (!meta.length) return <></>

  return (
    <>
      <MessageBubble>{title}</MessageBubble>
      <MessageBubble>
        {meta.map((msg, i) => (
          <React.Fragment key={i}>
            <div
              className={clsx(
                'flex items-center justify-between cursor-pointer',
                'hover:text-primary transition-all '
              )}
              onClick={(e) => onClick(e, msg)}
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
    </>
  )
}

export default SingleMessage
