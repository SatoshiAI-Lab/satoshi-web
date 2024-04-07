import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

import MessageBubble from './message-bubble'
import { ChatResponseMetaNewsInfo } from '@/api/chat/types'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import { t } from 'i18next'

const NewsBubble = ({
  content,
  created_at,
  title,
  logo,
  source,
}: ChatResponseMetaNewsInfo) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [relax, setRelax] = useState(false)
  const [tooLong, setTooLong] = useState(false)
  useEffect(() => {
    if (content.length > 100) {
      const contentElement = contentRef.current
      const isOverflown = contentElement!.offsetHeight > 80
      setRelax(isOverflown)
      setTooLong(true)
    }
  }, [])
  return (
    <MessageBubble className={clsx('min-w-bubble pt-4 flex flex-col')}>
      <div className="font-bold text-lg">{title}</div>
      <div className="my-2 text-gray-400">
        {dayjs(created_at).format('H:mm M/D')}
      </div>
      <div ref={contentRef} className={clsx('my-2', relax && 'line-clamp-3')}>
        {content}
      </div>
      {(tooLong && (
        <button
          className=" text-primary self-end"
          onClick={() => setRelax(!relax)}
        >
          {(relax && 'show more') || 'hide'}
        </button>
      )) || <></>}
      {source &&
        ((
          <a
            href={source}
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

export default NewsBubble
