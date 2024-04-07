import React, { useEffect, useRef, useState } from 'react'
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
  const contentRef = useRef<HTMLDivElement>(null)
  const [relax, setRelax] = useState(false)
  const [tooLong, setTooLong] = useState(false)
  useEffect(() => {
    if (content.en.length > 100) {
      const contentElement = contentRef.current
      const isOverflown = contentElement!.offsetHeight > 70
      setRelax(isOverflown)
      setTooLong(true)
    }
  }, [])
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
          <span className="font-bold">{twitter} just tweeted</span>
          <span className="text-gray-400">
            {dayjs(created_at).format('H:mm M/D')}
          </span>
        </div>
      </div>
      {/* Text content */}
      <div ref={contentRef} className={clsx('my-2', relax && 'line-clamp-3')}>
        {content.en}
      </div>
      {(tooLong && (
        <button
          className=" text-primary self-end"
          onClick={() => setRelax(!relax)}
        >
          {(relax && 'show more') || 'hide'}
        </button>
      )) || <></>}
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
        className="text-primary inline-block mt-3"
      >
        Origin Link
      </a>
    </MessageBubble>
  )
}

export default TwitterBubble
