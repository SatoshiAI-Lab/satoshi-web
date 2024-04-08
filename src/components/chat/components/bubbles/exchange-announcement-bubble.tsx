import React from 'react'
import clsx from 'clsx'

import MessageBubble from './message-bubble'
import { ChatResponseMetaAnnounceMent } from '@/api/chat/types'
import dayjs from 'dayjs'
import { Avatar } from '@mui/material'
import toast from 'react-hot-toast'
import { t } from 'i18next'

const ExchangeAnnouncementBubble = ({
  title,
  created_at,
  source_logo,
  source_name,
  url,
}: ChatResponseMetaAnnounceMent) => {
  return (
    <MessageBubble className={clsx('min-w-bubble py-4')}>
      {/* Avatar, chain */}
      <div className="flex items-stretch">
        {(source_logo && (
          <img
            src={source_logo}
            alt="avatar"
            className="w-12 h-12 rounded-full mr-2"
          />
        )) || <Avatar className="w-12 h-12 rounded-full mr-2" />}

        <div className="flex flex-col justify-between ">
          <span className="font-bold">
            {source_name} just released a new ann.
          </span>
          <span className="text-gray-400">
            {dayjs(created_at).format('H:mm M/D')}
          </span>
        </div>
      </div>
      {/* Event description */}
      <div className="mt-2 font-bold">{title.en}</div>
      {url.en &&
        ((
          <a
            href={url.en}
            target="_blank"
            className="text-primary inline-block mt-3"
          >
            Origin Link
          </a>
        ) || (
          <button
            onClick={() => toast(t('bubble.nolink'))}
            className="text-primary inline-block mt-3"
          >
            Origin Link
          </button>
        ))}
    </MessageBubble>
  )
}

export default ExchangeAnnouncementBubble
