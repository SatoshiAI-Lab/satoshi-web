import React, { useEffect, useRef } from 'react'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import MessageBubble from './components/message-bubble'
import MessageInput from './components/message-input'
import Messages from './components/messages'
import Live2DModel from '../live2d-model'
import { utilDom } from '@/utils/dom'
import { useChat } from '@/hooks/use-chat'
import { MessageAlert } from './components/message-alert'
import { useThrottledCallback } from '@/hooks/use-throttled-callback'

function Chat(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className = '' } = props
  const chatRef = useRef<HTMLDivElement | null>(null)
  const { t } = useTranslation()
  const {
    question,
    messages,
    isLoading,
    addMessageAndLoading,
    setChatEl,
    sendMsg,
    unreadMessages,
    setWaitAnswer,
    cancelAnswer,
  } = useChat()

  const waitMonitor = useThrottledCallback(function () {
    setWaitAnswer(true)
    console.log('user start waiting answer now!!!')
    setTimeout(function () {
      setWaitAnswer(false)
      console.log('user stop waiting answer now!!!')
    }, 10000)
  }, 10000)

  // Handle send.
  const onSend = async () => {
    // Do no show monitor message within 10 seconds
    waitMonitor()
    if (!question?.trim()) {
      toast.error(t('input-null'))
      return
    }
    if (isLoading) return

    addMessageAndLoading({ msg: question, position: 'right' })
    await sendMsg()
  }

  // setChatEl and scroll to latest message
  useEffect(() => {
    if (!chatRef.current) return

    setChatEl(chatRef.current)
    utilDom.scrollToBottom(chatRef.current)
  }, [])

  return (
    <div
      className={clsx(
        'flex relative max-sm:px-0 max-lg:pl-6 h-body',
        '2xl:justify-center',
        className
      )}
    >
      {/* Live2D model placeholder element */}
      <div
        className={clsx(
          'w-80 bottom-0 left-0 max-md:absolute max-lg:self-end',
          'max-md:h-4/5 max-lg:h-full max-lg:w-20'
        )}
      ></div>
      {/* Chat main element */}
      {(unreadMessages.length && <MessageAlert />) || <></>}
      <div
        className={clsx(
          'grow-[8] overflow-auto pb-0 pr-0',
          'flex flex-col gap-4 z-10 max-sm:pr-0',
          '2xl:max-w-chat 2xl:grow-unset'
        )}
      >
        <Live2DModel />
        <div
          className={clsx(
            'flex flex-col items-start grow',
            'overflow-auto z-10 max-sm:ml-20'
          )}
          ref={chatRef}
        >
          <MessageBubble className="mt-6">{t('message-default')}</MessageBubble>
          <Messages messages={messages} />
        </div>
        <MessageInput onSend={onSend} onCancel={cancelAnswer} />
      </div>
    </div>
  )
}

export default Chat
