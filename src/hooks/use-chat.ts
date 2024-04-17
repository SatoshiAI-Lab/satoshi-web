import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { nanoid } from 'nanoid'

import { chatApi } from '@/api/chat'
import { useChatStore } from '@/stores/use-chat-store'
import { CHAT_CONFIG } from '@/config/chat'
import { useLive2D } from './use-live2d'
import { useEventStream } from './use-event-stream'
import { useMessages } from './use-messages'
import { utilParse } from '@/utils/parse'
import { useLoginAuthStore } from '@/stores/use-need-login-store'
import { utilArr } from '@/utils/array'

import type {
  ChatInteractiveParams,
  ChatParams,
  ChatResponse,
} from '@/api/chat/types'

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
  const { setShow } = useLoginAuthStore()
  const { parseStream, cancelParseStream } = useEventStream()
  const {
    messages,
    question,
    intention,
    isLoading,
    setQuestion,
    setIntention,
    setReadAnswer,
    setIsLoading,
  } = useChatStore()
  const {
    startLoopMotion,
    stopLoopMotion,
    emitMotionSpeak,
    emitMotionWithWisdom,
  } = useLive2D()
  const {
    addStreamMessage,
    addNormalMessage,
    addTokenMessage,
    addInteractiveMessage,
    addReferenceMesssage,
    removeLastLoading,
    removeLast,
    addLoading,
    addMessage,
  } = useMessages()

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

  // Reading event-stream each data, handle message.
  const onReadEach = (data: ChatResponse) => {
    const { hiddenIntentText } = CHAT_CONFIG
    const {
      hide,
      streams,
      normals,
      interactive,
      reference,
      end,
      intentStream,
      intention,
    } = CHAT_CONFIG.answerType

    if (data.answer_type === 'end') {
      setReadAnswer(true)
      console.log('user start reading answer now!!!')
      setTimeout(function () {
        setReadAnswer(false)
        console.log('user stop reading answer now!!!')
      }, 10000)
    }

    const answerType = data.answer_type
    const isIntention = answerType.startsWith(intentStream)
    const metaType = data.meta?.type

    if (isIntention) {
      setIntention(answerType!)
    }

    // The AI's metadata may contain a prompt to log in
    if (data.meta?.status == 401) {
      toast.error(t('need.login'))
      setShow(true)
      return
    }

    // remove null message
    if (answerType.includes(hide)) {
      removeLast()
      return
    }

    // Intention message.
    if (
      intention.includes(answerType) ||
      isIntention ||
      intention.includes(metaType ?? '') // create token message
    ) {
      if (data.text && !hiddenIntentText.includes(data?.meta.type!)) {
        addStreamMessage(data)
      }

      data.meta.data?.reverse?.()

      addNormalMessage(data, { isIntention: true })
      return
    }

    // Streaming answer.
    if (streams.includes(answerType)) {
      // Don't use trim.
      if (!data.text) return

      addStreamMessage(data)
      return
    }

    // Token answer.
    if (normals.includes(answerType)) {
      addTokenMessage(data)
      return
    }

    // Interactive answer.
    if (answerType === interactive) {
      addInteractiveMessage(data)
      return
    }

    // Origin reference
    if (answerType === reference) {
      addReferenceMesssage(data)
      return
    }

    // Answer ended & include emotion & is not interactive message.
    const isNotInteractive = !utilArr.last(messages)?.isInteractive
    if (answerType === end && data.meta.emotion && isNotInteractive) {
      emitMotionWithWisdom(data.meta.emotion)
    }
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

      parseStream(
        stream,
        (message) => utilParse.streamStrToJson(message, onReadEach),
        resetChat
      )
    } catch (e: any | undefined) {
      throwChatError(e)
      setIsLoading(false)
    } finally {
      stopLoopMotion()
      removeLastLoading()
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
