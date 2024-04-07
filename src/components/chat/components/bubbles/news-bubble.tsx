import React from 'react'
import clsx from 'clsx'

import MessageBubble from './message-bubble'
import { ChatResponseMetaNewsInfo } from '@/api/chat/types'
import dayjs from 'dayjs'

const NewsBubble = ({
  content,
  created_at,
  title,
  logo,
  source,
}: ChatResponseMetaNewsInfo) => {
  return (
    <MessageBubble className={clsx('min-w-bubble pt-4')}>
      <div className="font-bold text-lg">{title}</div>
      <div className="my-2 text-gray-400">
        {dayjs(created_at).format('H:mm M/D')}
      </div>
      <div>{content}</div>
      <a
        href={source}
        target="_blank"
        className="text-primary inline-block mt-3"
      >
        Origin Link
      </a>
    </MessageBubble>
  )
}

export default NewsBubble
