import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import { nanoid } from 'nanoid'
import { last } from 'lodash'

import type {
  ChatMeta,
  ChatInteractiveParams,
  ChatParams,
  ChatResponse,
} from '@/api/chat/types'

import { chatApi } from '@/api/chat'
import { useChatStore } from '@/stores/use-chat-store'
import { useLive2D } from './use-live2d'
import { useMessages } from './use-messages'
import { UseChatTypeReturns, useChatType } from './use-chat-type'
import { useEventStream } from './use-event-stream'
import { useLoginAuthStore } from '@/stores/use-need-login-store'
import { utilParse } from '@/utils/parse'
import { ResponseCode } from '@/api/fetcher/types'

export interface InteractiveOptions {
  question: string
  id?: number
  type?: number
  name?: string
  selected_entities?: ChatInteractiveParams[]
}

export type SendChat = ReturnType<typeof useChat>['sendChat']

export type StopChat = ReturnType<typeof useChat>['stopChat']

type MessageHandler = (
  data: ChatResponse,
  type: UseChatTypeReturns['processAnswerType']
) => void

const hasEmotion = (meta: ChatMeta) => !!meta.emotion

export const useChat = () => {
  const { t, i18n } = useTranslation()
  const controllerRef = useRef<AbortController>()
  const {
    messages,
    question,
    isLoading,
    setQuestion,
    setIsLoading,
    getMessages,
    addMessage,
    scrollToChatBottom,
    setReadAnswer,
  } = useChatStore()
  const {
    startLoopMotion,
    stopLoopMotion,
    emitMotionSpeak,
    emitMotionWithWisdom,
  } = useLive2D()
  const {
    addLoading,
    removeLastLoading,
    createMessageManage,
    createProcessManage,
    addClearHistoryMessage,
    addReferenceMessage,
  } = useMessages()
  const { processAnswerType } = useChatType()
  const { parseStream, cancelParseStream } = useEventStream()
  const { setShow } = useLoginAuthStore()

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

  const sendChatBefore = (params: ChatParams) => {
    setIsLoading(true)

    // Reset chat states.
    setQuestion('')

    // Live2D model about.
    emitMotionSpeak('Thinking')
    startLoopMotion('Thinking')

    // Add message to display.
    addMessage({ role: 'user', text: params.question })
    addLoading()
    scrollToChatBottom()
  }

  const streamToMessage = <S extends ReadableStream>(stream: S) => {
    const { add, addNew } = createMessageManage()
    // process message is special, managed separately.
    const {
      addProcess,
      removeProcess,
      shouldRemoveProcess,
      markedRemoveProcess,
    } = createProcessManage()

    const handleEnd = ({ meta }: ChatResponse) => {
      setReadAnswer(true)
      setTimeout(() => setReadAnswer(false), 10_000)

      const lastMessageType = last(getMessages())?.answer_type
      const { isInteractive } = processAnswerType(lastMessageType)

      // Emit live2d motion if the last message is not
      // an interactive message & `meta` have `emotion`.
      if (!isInteractive && hasEmotion(meta)) {
        emitMotionWithWisdom(meta.emotion as any)
      }
    }

    const handleStream: MessageHandler = (data, type) => {
      // If you need `if` judge, add here...
      add(data)
    }

    const handleNonStream: MessageHandler = (data, type) => {
      // Special handle reference message.
      if (type.isReference) return add(addReferenceMessage(data))

      // Handle end message.
      if (type.isEnd) return handleEnd(data)

      // General, non-stream is token related,
      // Token related just render `hyper_text`,
      // It doesn't need text, so we must clear it.
      data.text = ''
      addNew(data)
    }

    const onEachParse = (data: ChatResponse) => {
      console.log(data)

      const type = processAnswerType(data.answer_type)

      // Auth required.
      if (data.meta.status === ResponseCode.Auth) {
        toast.error(t('need.login'))
        setShow(true)
        return
      }

      // Process message category.
      if (type.isProcessStream) return addProcess(data, true)
      if (type.isProcessStreamEnd) return markedRemoveProcess()
      if (shouldRemoveProcess()) removeProcess()

      // Stream message category.
      if (type.isStream) return handleStream(data, type)

      // Non-stream message category.
      handleNonStream(data, type)
    }

    const onRead = (m: string, isFirst: boolean) => {
      if (isFirst) removeLastLoading()
      utilParse.streamStrToJson(m, onEachParse)
      scrollToChatBottom()
    }

    const debugId = nanoid()
    console.log(`------- chat ${debugId} start -------`)

    parseStream(stream, onRead, () => {
      resetChat()
      console.log(`------- chat ${debugId} end -------`)
    })
  }

  // Send chat.
  const sendChat = async (options?: InteractiveOptions) => {
    // Must be get params here.
    const chatParams = getChatParams(options)

    if (isLoading) {
      toast.error(t('chat.asking'))
      return
    }

    sendChatBefore(chatParams)
    try {
      controllerRef.current = new AbortController()
      const stream = await chatApi.chat(
        chatParams,
        controllerRef.current.signal
      )

      streamToMessage(stream)
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

  // Reset chat states.
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
