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
}: ChatResponseMetaNewsInfo) => {
  return (
    <MessageBubble className={clsx('min-w-bubble pt-4')}>
      <div className="font-bold text-lg">{title}</div>
      <div className="my-2 text-gray-400">
        {dayjs(created_at).format('H:mm M/D')}
      </div>
      <div>{content}</div>
      {/* TODO: click img to enlarge show. */}
      <img
        src={logo}
        alt="image"
        className="max-w-[300px] max-h-[300px] rounded mt-2"
      />
      <a href="#" target="_blank" className="text-primary inline-block mt-3">
        Origin Link
      </a>
    </MessageBubble>
  )
}

export default NewsBubble
