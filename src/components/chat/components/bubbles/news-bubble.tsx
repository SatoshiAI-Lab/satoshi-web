import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

import MessageBubble from './message-bubble'
import { ChatResponseMetaNewsInfo } from '@/api/chat/types'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import { t } from 'i18next'
import i18n from '@/i18n'
import ShowMoreText from 'react-show-more-text'

const NewsBubble = ({
  content,
  created_at,
  title,
  source,
}: ChatResponseMetaNewsInfo) => {
  const { language } = i18n
  const currentContent =
    content[language] || Object.values(content).find((v) => v) || ''
  const currentTitle =
    title[language] || Object.values(title).find((v) => v) || ''
  const originLinkButton = () => {
    if (source) {
      return (
        <a href={source} target="_blank" className="text-primary w-fit">
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
      className={clsx(
        '!min-w-[450px] !max-w-[550px] pt-[12px] pr-[14px] pb-[15px] pl-[18px] flex flex-col'
      )}
    >
      <div className="font-bold text-[18px]">{currentTitle}</div>
      <div className="text-[#10101040] text-[14px] mt-[5px]">
        {dayjs(created_at).format('H:mm M/D')}
      </div>
      <ShowMoreText
        anchorClass="text-primary cursor-pointer block text-sm w-fit ml-auto"
        className="mt-[11px] mb-[15px]"
        lines={4}
        more={t('bubble.show.more')}
        less={t('bubble.show.hide')}
      >
        {currentContent}
      </ShowMoreText>
      {originLinkButton()}
    </MessageBubble>
  )
}

export default NewsBubble
