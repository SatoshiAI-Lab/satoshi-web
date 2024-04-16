import React from 'react'
import { useTranslation } from 'react-i18next'
import { BsChevronRight } from 'react-icons/bs'
import { Divider } from '@mui/material'
import clsx from 'clsx'
import toast from 'react-hot-toast'

import MessageBubble from './message-bubble'
import { utilDom } from '@/utils/dom'

import type {
  ChatResponseAnswerMeta,
  ChatResponseAnswerMetaCoin,
  ChatResponseMetaLabel,
} from '@/api/chat/types'
import { useChat } from '@/hooks/use-chat'

interface SingleMessageProps {
  id?: string
  msgs?: ChatResponseAnswerMetaCoin[] | ChatResponseMetaLabel[]
  type?: keyof ChatResponseAnswerMeta
  classes?: string
  title?: string
  onClick?: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    msg: ChatResponseAnswerMetaCoin
  ) => void
}

function SingleMessage(props: SingleMessageProps) {
  const [t] = useTranslation()
  const { msgs = [], title, id } = props
  const { sendMsg, isLoading, addMessageAndLoading, findPrevInteractive } =
    useChat()

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
      toast(t('chat.message-getting'))
      return
    }

    const { targetEl } = utilDom.eventProxy(e.target as HTMLElement, 'div')
    const tokenName = targetEl.firstChild?.textContent ?? ''
    const prevMsg = findPrevInteractive(id) ?? { msg: msg.name }
    const interactiveOps = {
      id: msg.id,
      type: msg.type,
      name: tokenName,
      question: prevMsg.msg,
    }

    addMessageAndLoading({
      msg: prevMsg.msg,
      position: 'right',
    })
    sendMsg(interactiveOps)
  }

  if (!msgs.length) return <></>

  console.log('msgs', msgs)

  return (
    <>
      <MessageBubble>{title}</MessageBubble>
      <MessageBubble>
        {msgs.map((msg, i) => (
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
            {msgs.length - 1 !== i && (
              <Divider className="!my-2 !border-[#c9c9c9]" />
            )}
          </React.Fragment>
        ))}
      </MessageBubble>
    </>
  )
}

export default SingleMessage
