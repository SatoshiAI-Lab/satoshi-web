import React from 'react'
import clsx from 'clsx'
import { t } from 'i18next'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import ShowMoreText from 'react-show-more-text'

import MessageBubble from '../message-bubble'
import { utilLang } from '@/utils/language'

import type { ChatResponseMetaNewsInfo } from '@/api/chat/types'

interface Props {
  data: ChatResponseMetaNewsInfo
}

const NewsBubble = ({ data }: Props) => {
  const { content, created_at, title, source } = data
  const currentContent = utilLang.getContent(content)
  const currentTitle = utilLang.getContent(title)
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
        'w-bubble pt-[12px] pr-[14px] pb-[15px] pl-[18px] flex flex-col'
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
