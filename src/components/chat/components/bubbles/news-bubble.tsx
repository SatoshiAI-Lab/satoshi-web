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
        <a href={source} target="_blank" className="text-primary w-fit mt-3">
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
    <MessageBubble className={clsx('min-w-bubble pt-4 flex flex-col')}>
      <div className="font-bold text-lg">{currentTitle}</div>
      <div className="my-2 text-gray-400">
        {dayjs(created_at).format('H:mm M/D')}
      </div>
      <ShowMoreText
        anchorClass="text-primary cursor-pointer block text-sm w-fit ml-auto"
        className="my-2"
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
