import React, { useEffect, useRef } from 'react'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { nanoid } from 'nanoid'

import MessageBubble from './components/message-bubble'
import MessageInput from './components/message-input'
import Messages from './components/messages'
import Live2DModel from '../live2d-model'
import { utilDom } from '@/utils/dom'
import { useChat } from '@/hooks/use-chat'
import { MessageAlert } from './components/message-alert'
import { useThrottledCallback } from '@/hooks/use-throttled-callback'

export const Chat = (props: React.HTMLAttributes<HTMLDivElement>) => {
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
    setQuestion,
  } = useChat()
  const waitMonitor = useThrottledCallback(function () {
    setWaitAnswer(true)
    console.log('user start waiting answer now!!!')
    setTimeout(function () {
      setWaitAnswer(false)
      console.log('user stop waiting answer now!!!')
    }, 10000)
  }, 10000)
  const defaultChatOptions = [
    {
      id: nanoid(),
      title: t('create-wallet'),
      details: t('create-wallet-details'),
    },
    {
      id: nanoid(),
      title: t('view-wallets'),
      details: t('view-wallets-details'),
    },
    {
      id: nanoid(),
      title: t('create-token'),
      details: t('create-token-details'),
    },
  ]

  // Handle send.
  const onSend = async () => {
    // Do no show monitor message within 10 seconds
    waitMonitor()
    if (!question?.trim()) {
      toast.error(t('input-null'))
      return
    }
    if (isLoading) return

    addMessageAndLoading({
      msg: question,
      position: 'right',
    })
    await sendMsg()
  }

  const onHelpClick = async (option: (typeof defaultChatOptions)[number]) => {
    setQuestion(option.details)
    addMessageAndLoading({
      msg: option.details,
      position: 'right',
    })
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
          <MessageBubble className="mt-6">
            <div className="mb-1">{t('message-default')}</div>
            <div className="flex items-center text-gray-500">
              {t('help-me')}:{' '}
              {defaultChatOptions.map((o) => (
                <div
                  key={o.id}
                  className={clsx(
                    'ml-2 cursor-pointer hover:text-black',
                    'transition-all duration-300'
                  )}
                  onClick={() => onHelpClick(o)}
                >
                  {o.title}
                </div>
              ))}
            </div>
          </MessageBubble>
          <Messages messages={messages} />
        </div>
        <MessageInput onSend={onSend} onCancel={cancelAnswer} />
      </div>
    </div>
  )
}

export default Chat
