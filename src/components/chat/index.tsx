import React, { useEffect, useRef } from 'react'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import MessageBubble from './components/message-bubble'
import MessageInput from './components/message-input'
import { utilDom } from '@/utils/dom'

function Chat(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className = '' } = props
  const chatRef = useRef<HTMLDivElement | null>(null)
  const { t } = useTranslation()

  // Handle send.
  const onSend = async () => {
    toast('Sending...')
  }

  // setChatEl and scroll to latest message
  useEffect(() => {
    if (!chatRef.current) return

    utilDom.scrollToBottom(chatRef.current)
  }, [])

  return (
    <div
      className={clsx(
        'flex relative max-sm:px-0 max-lg:pl-6 h-body',
        className
      )}
    >
      <div
        className={clsx(
          'w-80 bottom-0 left-0 max-md:absolute max-lg:self-end',
          'max-md:h-4/5 max-lg:h-full max-lg:w-20'
        )}
      ></div>
      {/* Chat main element */}
      <div
        className={clsx(
          'grow-[8] overflow-auto pb-0 pr-0',
          'flex flex-col gap-4 z-10 max-sm:pr-0'
        )}
      >
        <div
          className={clsx(
            'flex flex-col items-start grow',
            'overflow-auto z-10 max-sm:ml-20'
          )}
          ref={chatRef}
        >
          <MessageBubble className="mt-6">{t('message-default')}</MessageBubble>
        </div>
        <MessageInput onSend={onSend} />
      </div>
    </div>
  )
}

export default Chat
