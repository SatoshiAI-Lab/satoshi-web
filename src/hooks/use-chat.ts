import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'

import { chatApi } from '@/api/chat'
import { useChatStore } from '@/stores/use-chat-store'
import { useLive2D } from './use-live2d'
import { useEventStream } from './use-event-stream'
import { useMessages } from './use-messages'
import { useChatMessages } from './use-chat-messages'
import { utilParse } from '@/utils/parse'
import { utilDom } from '@/utils/dom'

import type { ChatInteractiveParams, ChatParams } from '@/api/chat/types'

export interface InteractiveOptions {
  question: string
  id?: number
  type?: number
  name?: string
  selected_entities?: ChatInteractiveParams[]
}

export const useChat = () => {
  const { t, i18n } = useTranslation()
  const controllerRef = useRef<AbortController>()
  const { parseStream, cancelParseStream } = useEventStream()
  const {
    chatEl,
    messages,
    question,
    intention,
    isLoading,
    setQuestion,
    setIntention,
    setIsLoading,
  } = useChatStore()
  const { startLoopMotion, stopLoopMotion, emitMotionSpeak } = useLive2D()
  const { removeLastLoading, addLoading, addMessage } = useMessages()
  const { parseChatMessage } = useChatMessages()

  const getChatParams = (options?: InteractiveOptions) => {
    const {
      id,
      type,
      selected_entities,
      question: iQuestion = '', // interactive question
    } = options ?? {}
    const params: ChatParams = {
      question,
      user_info: {
        username: 'anonymous',
        is_vip: true,
        preference: { language: i18n.language },
        favorite: {},
      },
      history: [],
      stream: true,
      intent_stream: intention,
    }

    // multi interactive
    if (selected_entities) {
      params.selected_entities = selected_entities
      params.question = iQuestion
    } else if (options) {
      // normal interactive
      params.id = id
      params.type = type
      params.question = iQuestion
    }

    return params
  }

  const throwChatError = (e: any | undefined) => {
    if (e?.status == 401) {
      toast.error(t('need.login'))
    } else if (String(e).includes('AbortError')) {
      // Don't do anything.
    } else {
      toast.error(String(e))
    }
  }

  // After each read call,
  // a message string may contains multi lines.
  const onEachRead = (message: string, isFirstRead: boolean) => {
    utilParse.streamStrToJson(message, (data, isFirstParse) => {
      parseChatMessage(data, isFirstRead, isFirstParse)
      // Each read scroll to bottom.
      chatEl && utilDom.scrollToBottom(chatEl)
    })
  }

  const sendChatBefore = (params: ChatParams) => {
    setIsLoading(true)

    // Reset chat states.
    setQuestion('')
    setIntention('')

    // Live2D model about.
    emitMotionSpeak('Thinking')
    startLoopMotion('Thinking')

    // Add message to display.
    addMessage({
      role: 'user',
      text: params.question,
    })
    addLoading()
  }

  // Send chat.
  const sendChat = async (options?: InteractiveOptions) => {
    // Must be get params here.
    const chatParams = getChatParams(options)

    try {
      sendChatBefore(chatParams)
      controllerRef.current = new AbortController()
      const stream = await chatApi.chat(
        chatParams,
        controllerRef.current.signal
      )

      parseStream(stream, onEachRead, resetChat)
    } catch (e: any | undefined) {
      throwChatError(e)
      resetChat()
    } finally {
      // Don't `resetChat` on finally.
      // It's just finally of request, is not stream finally.
    }
  }

  // Stop chat.
  const stopChat = async () => {
    resetChat()
    await cancelParseStream()
    controllerRef.current?.abort()
    toast(t('cancel-answer'))
  }

  // Rest chat states.
  const resetChat = () => {
    stopLoopMotion()
    removeLastLoading()
    setIsLoading(false)
  }

  return {
    messages,
    question,
    intention,
    isLoading,
    sendChat,
    stopChat,
    resetChat,
  }
}
