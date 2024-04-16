import React from 'react'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { Avatar } from '@mui/material'
import toast from 'react-hot-toast'
import { t } from 'i18next'

import { MessageBubble } from '../bubbles/message-bubble'
import { utilLang } from '@/utils/language'

import type { ChatResponseMetaAnnounceMent } from '@/api/chat/types'

interface Props {
  data: ChatResponseMetaAnnounceMent
}

const ExchangeAnnouncementBubble = ({ data }: Props) => {
  const { title, created_at, source_logo, source_name, url } = data
  const currentTitle = utilLang.getContent(title)

  const originLinkButton = () => {
    const link = utilLang.getContent(url)
    if (link) {
      return (
        <a href={link} target="_blank" className="text-primary w-fit">
          {t('bubble.originlink')}
        </a>
      )
    }
    return (
      <button
        onClick={() => toast(t('bubble.nolink'))}
        className="text-gray-400 w-fit"
      >
        {t('bubble.originlink')}
      </button>
    )
  }
  return (
    <MessageBubble
      className={clsx('!w-bubble pt-[12px] pr-[14px] pb-[15px] pl-[18px]')}
    >
      {/* Avatar, chain */}
      <div className="flex items-stretch">
        {(source_logo && (
          <img
            src={source_logo}
            alt="avatar"
            className="w-[40px] h-[40px] rounded-full mr-2"
          />
        )) || <Avatar className="w-[40px] h-[40px] rounded-full mr-2" />}

        <div className="flex flex-col justify-between ">
          <span className="font-bold text-[14px]">
            {source_name} {t('bubble.new-anno')}
          </span>
          <span className="text-[#10101040] text-[14px]">
            {dayjs(created_at).format('H:mm M/D')}
          </span>
        </div>
      </div>
      {/* Event description */}
      <div className="mt-[11px] mb-[15px] font-bold">{currentTitle}</div>
      {originLinkButton()}
    </MessageBubble>
  )
}

export default ExchangeAnnouncementBubble
