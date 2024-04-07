import React from 'react'
import clsx from 'clsx'

import MessageBubble from './message-bubble'
import { ChatResponseMetaAnnounceMent } from '@/api/chat/types'
import dayjs from 'dayjs'

const ExchangeAnnouncementBubble = ({
  title,
  created_at,
  source_logo,
  url,
  children,
}: ChatResponseMetaAnnounceMent & { children: React.ReactNode }) => {
  return (
    <MessageBubble className={clsx('min-w-bubble py-4')}>
      {/* Avatar, chain */}
      <div className="flex items-stretch">
        <img
          src="/images/i1.png"
          alt="avatar"
          className="w-12 h-12 rounded-full mr-2"
        />
        <div className="flex flex-col justify-between ">
          <span className="font-bold">{title.en}</span>
          <span className="text-gray-400">
            {dayjs(created_at).format('H:mm M/D')}
          </span>
        </div>
      </div>
      {/* Event description */}
      <div className="mt-2 font-bold">{children}</div>
      <a
        href={url.en}
        target="_blank"
        className="text-primary inline-block mt-2"
      >
        Origin Link
      </a>
    </MessageBubble>
  )
}

export default ExchangeAnnouncementBubble
