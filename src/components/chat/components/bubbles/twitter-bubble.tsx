import React from 'react'
import clsx from 'clsx'

import MessageBubble from './message-bubble'
import { ChatResponseMetaTwitter } from '@/api/chat/types'
import dayjs from 'dayjs'

const TwitterBubble = ({
  content,
  created_at,
  twitter,
  tweets_id,
  twitter_logo,
  photo,
}: ChatResponseMetaTwitter) => {
  return (
    <MessageBubble className={clsx('min-w-bubble pt-4')}>
      {/* Avatar, name */}
      <div className="flex items-stretch">
        <img
          src={twitter_logo}
          alt="avatar"
          className="w-12 h-12 rounded-full mr-2"
        />
        <div className="flex flex-col justify-between">
          <span className="font-bold">{twitter} just tweeted</span>
          <span className="text-gray-400">
            {dayjs(created_at).format('H:mm M/D')}
          </span>
        </div>
      </div>
      {/* Text content */}
      <div className="my-2">{content.en}</div>
      {/* TODO: click img to enlarge show. */}
      {photo.map((item) => (
        <img
          src={item}
          alt="img"
          className="rounded-md max-h-[300px] max-w-[300px]"
        />
      ))}
      <a
        href={`https://twitter.com/${twitter}/status/${tweets_id}`}
        target="_blank"
        className="text-primary inline-block mt-3"
      >
        Origin Link
      </a>
    </MessageBubble>
  )
}

export default TwitterBubble
