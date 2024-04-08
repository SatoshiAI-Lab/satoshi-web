import React from 'react'
import clsx from 'clsx'

import MessageBubble from './message-bubble'
import { ChatResponseMetaAnnounceMent } from '@/api/chat/types'
import dayjs from 'dayjs'
import { Avatar } from '@mui/material'
import toast from 'react-hot-toast'
import { t } from 'i18next'
import i18n from '@/i18n'

const ExchangeAnnouncementBubble = ({
  title,
  created_at,
  source_logo,
  source_name,
  url,
}: ChatResponseMetaAnnounceMent) => {
  const { language } = i18n
  const currentTitle =
    title[language] || Object.values(title).find((v) => v) || ''

  const originLinkButton = () => {
    const link = url[language] || Object.values(url).find((v) => v)
    if (link) {
      return (
        <a href={link} target="_blank" className="text-primary w-fit mt-3">
          {t('bubble.originlink')}
        </a>
      )
    }
    return (
      <button
        onClick={() => toast(t('bubble.nolink'))}
        className="text-gray-400 w-fit mt-3"
      >
        {t('bubble.originlink')}
      </button>
    )
  }
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
            {source_name} {t('bubble.new-anno')}
          </span>
          <span className="text-gray-400">
            {dayjs(created_at).format('H:mm M/D')}
          </span>
        </div>
      </div>
      {/* Event description */}
      <div className="mt-2 font-bold">{currentTitle}</div>
      {originLinkButton()}
    </MessageBubble>
  )
}

export default ExchangeAnnouncementBubble
