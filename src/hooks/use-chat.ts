import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import { nanoid } from 'nanoid'

import type { ChatInteractiveParams, ChatParams } from '@/api/chat/types'

import { chatApi } from '@/api/chat'
import { useChatStore } from '@/stores/use-chat-store'
import { useLive2D } from './use-live2d'
import { useEventStream } from './use-event-stream'
import { useMessages } from './use-messages'
import { utilParse } from '@/utils/parse'

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
    messages,
    question,
    isLoading,
    setQuestion,
    setIsLoading,
    addMessage,
    chatScrollToBottom,
  } = useChatStore()
  const { startLoopMotion, stopLoopMotion, emitMotionSpeak } = useLive2D()
  const {
    parseChatMessage,
    removeLastLoading,
    addLoading,
    addClearHistoryMessage,
  } = useMessages()

  const getChatParams = (options?: InteractiveOptions) => {
    const {
      id,
      type,
      selected_entities,
      question: newQuestion = '', // interactive question
    } = options ?? {}
    const params: ChatParams = {
      // question: newQuestion || question,
      question,
      user_info: {
        username: 'anonymous',
        is_vip: true,
        preference: { language: i18n.language },
        favorite: {},
      },
      history: [],
      stream: true,
    }

    // multi interactive
    if (selected_entities) {
      params.selected_entities = selected_entities
      params.question = newQuestion
    } else if (options) {
      // normal interactive
      params.id = id
      params.type = type
      params.question = newQuestion
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
      chatScrollToBottom()
    })
  }

  const sendChatBefore = (params: ChatParams) => {
    setIsLoading(true)

    // Reset chat states.
    setQuestion('')

    // Live2D model about.
    emitMotionSpeak('Thinking')
    startLoopMotion('Thinking')

    // Add message to display.
    addMessage({
      role: 'user',
      text: params.question,
    })
    addLoading()
    chatScrollToBottom()
  }

  // Send chat.
  const sendChat = async (options?: InteractiveOptions) => {
    // Must be get params here.
    const chatParams = getChatParams(options)
    const debugId = nanoid()

    // If question is custom static question, don't send request.
    // const isCustom = parseCustomMessage(chatParams)
    // if (isCustom) return

    sendChatBefore(chatParams)
    try {
      controllerRef.current = new AbortController()
      const stream = await chatApi.chat(
        chatParams,
        controllerRef.current.signal
      )

      console.log(`-------------- chat ${debugId} start --------------`)
      parseStream(stream, onEachRead, () => {
        console.log(`-------------- chat ${debugId} end --------------`)
        resetChat()
      })
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

  // Clear chat history.
  const clearHistory = async () => {
    if (isLoading) {
      toast.error(t('chat.wait-hint'))
      return
    }
    const id = toast.loading(t('clearing'))
    try {
      await chatApi.clearHistory()
      addClearHistoryMessage()
      toast.success(t('clear.success'))
    } catch (error) {
      toast.error(t('clear.failed'))
    } finally {
      toast.dismiss(id)
    }
  }

  return {
    messages,
    question,
    isLoading,
    sendChat,
    stopChat,
    resetChat,
    clearHistory,
  }
}
