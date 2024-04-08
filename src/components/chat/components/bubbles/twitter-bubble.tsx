import React, { useRef } from 'react'
import clsx from 'clsx'

import MessageBubble from './message-bubble'
import { ChatResponseMetaTwitter } from '@/api/chat/types'
import dayjs from 'dayjs'
import i18n from '@/i18n'
import { t } from 'i18next'
import ShowMoreText from 'react-show-more-text'

const TwitterBubble = ({
  content,
  created_at,
  twitter,
  tweets_id,
  twitter_logo,
  photo,
}: ChatResponseMetaTwitter) => {
  const { language } = i18n
  const currentContent =
    content[language] || Object.values(content).find((v) => v) || ''
  return (
    <MessageBubble className={clsx('min-w-bubble pt-4 flex flex-col')}>
      {/* Avatar, name */}
      <div className="flex items-stretch">
        <img
          src={twitter_logo}
          alt="avatar"
          className="w-12 h-12 rounded-full mr-2"
        />
        <div className="flex flex-col justify-between">
          <span className="font-bold">
            {twitter} {t('bubble.new-tweet')}
          </span>
          <span className="text-gray-400">
            {dayjs(created_at).format('H:mm M/D')}
          </span>
        </div>
      </div>
      {/* Text content */}
      <ShowMoreText
        anchorClass="text-primary cursor-pointer block text-sm w-fit ml-auto"
        className="my-2"
        lines={4}
        more={t('bubble.show.more')}
        less={t('bubble.show.hide')}
      >
        {currentContent}
      </ShowMoreText>
      {/* TODO: click img to enlarge show. */}
      {photo.map((item) => (
        <img
          key={item}
          src={item}
          alt="img"
          className="rounded-md max-h-[300px] max-w-[300px]"
        />
      ))}
      <a
        href={`https://twitter.com/${twitter}/status/${tweets_id}`}
        target="_blank"
        className="text-primary inline-block mt-3 w-fit"
      >
        {t('bubble.originlink')}
      </a>
    </MessageBubble>
  )
}

export default TwitterBubble
