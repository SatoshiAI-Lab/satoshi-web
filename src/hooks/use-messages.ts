import { nanoid } from 'nanoid'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import { last } from 'lodash'

import type { Message } from '@/stores/use-chat-store/types'
import {
  AnswerType,
  type MonitorData,
  type ChatResponse,
} from '@/api/chat/types'

import { useChatStore } from '@/stores/use-chat-store'
import { CHAT_CONFIG } from '@/config/chat'
import { useLoginAuthStore } from '@/stores/use-need-login-store'
import { useLive2D } from './use-live2d'
import { useHypertext } from './use-hyper-text-parser'
import { useChatType } from './use-chat-type'

export const useMessages = () => {
  const { t } = useTranslation()
  const {
    messages,
    getMessages,
    addMessage,
    updateMessage,
    removeMessage,
    setReadAnswer,
    setIntention,
  } = useChatStore()
  const { setShow } = useLoginAuthStore()
  const { emitMotionWithWisdom } = useLive2D()
  const hypertextParser = useHypertext(CHAT_CONFIG.hyperTextRule)
  const { identifyAnswerType, hasEmotion } = useChatType()

  // Remove latest message.
  const removeLast = () => {
    const lastId = last(getMessages())?.id

    if (!lastId) return
    removeMessage(lastId)
  }

  // Add a loading message.
  const addLoading = () => {
    addMessage({
      role: 'assistant',
      isLoading: true,
      text: 'Loading...',
    })
  }

  // Remove latest loading message.
  const removeLastLoading = () => {
    const loadings = getMessages().filter((m) => m.isLoading)
    const lastId = last(loadings)?.id

    if (!lastId) return
    removeMessage(lastId)
  }

  // Find previous interactive message.
  const findPrevInteractive = (id?: string) => {
    if (!id || !id.trim()) return
    const messages = getMessages()
    let m = messages.findIndex((m) => m.id === id)
    let msg: Message | undefined

    while (msg?.role !== 'user' && m !== -1) {
      m -= 1
      msg = messages[m]
    }

    return msg
  }

  // Stream message.
  const addStreamMessage = (
    data: ChatResponse,
    m?: Partial<Message>,
    overrideText = false
  ) => {
    const lastMessage = last(getMessages())

    if (!lastMessage) return
    const newMessage: Message = {
      ...data,
      ...lastMessage,
      ...m,
      role: 'assistant',
      text: overrideText ? data.text : lastMessage.text + data.text,
    }

    updateMessage(lastMessage.id, newMessage)
  }

  // Normal message.
  const addNormalMessage = (data: ChatResponse, m?: Partial<Message>) => {
    addMessage({ ...data, ...m, role: 'assistant' })
  }

  // Token about message.
  const addTokenMessage = (data: ChatResponse, m?: Partial<Message>) => {
    addMessage({
      ...data,
      ...m,
      role: 'assistant',
      text: hypertextParser(data.hyper_text).trim() + '\n\n',
    })
  }

  // Interactive message.
  const addInteractiveMessage = (data: ChatResponse) => {
    addNormalMessage(data, { isInteractive: true })
  }

  // Reference message.
  // TODO: Optimzie this method.
  const addReferenceMesssage = (data: ChatResponse) => {
    const { reference } = CHAT_CONFIG.answerType
    const { type, content, published_at, url } = data.meta
    const parsedContent = content?.replaceAll('\n', '<br />')
    // Must be complete tag
    const refTag = `
      <${reference} 
        type=\"${type}\"
        published_at=\"${published_at}\" 
        url=\"${url}\"
      >${parsedContent}</${reference}>
    `
    const newMessage = {
      ...data,
      text: data.text + refTag,
    }

    addStreamMessage(newMessage, { isReference: true })
  }

  // Monitor message.
  const addMonitorMessages = (monitors: MonitorData[]) => {
    monitors.forEach((m) => {
      addMessage({
        role: 'assistant',
        text: '',
        answer_type: AnswerType.WsMonitor,
        hyper_text: '',
        meta: {
          type: m.data_type,
          data: m,
        },
        data_type: m.data_type,
        isMonitor: true,
      })
    })
  }

  let processId = ''
  // Parseing & render message, by chat `answer_type` or `meta.type`.
  const parseChatMessage = (
    data: ChatResponse,
    isFirstRead?: boolean,
    isFirstParse?: boolean
  ) => {
    const { answer_type, meta } = data
    const {
      isNormal,
      isInteractive,
      isReference,
      isEnd,
      isHide,
      isStream,
      isIntent,
      isProcess,
    } = identifyAnswerType(answer_type)

    console.log('chat response', data)

    if (isFirstRead) {
      removeLastLoading()
      // on first read, add a blank message,
      // used for process message fill it.
      addMessage({ role: 'assistant', text: '' })
    }

    if (isEnd) {
      setReadAnswer(true)
      setTimeout(function () {
        setReadAnswer(false)
      }, 10000)
      return
    }

    if (isIntent) {
      setIntention(answer_type)
    }

    if (meta.status === 401) {
      toast.error(t('need.login'))
      setShow(true)
      return
    }

    if (isHide) {
      removeLast()
      return
    }

    if (isProcess) {
      if (!processId) processId = nanoid()
      addStreamMessage(data, { id: processId }, true)
      return
    }

    if (processId) {
      // Is not stream message, remove process message.
      if (!isStream || isIntent) removeMessage(processId)
      // Is stream message, clear process message.
      else if (isStream) {
        updateMessage(processId, { role: 'assistant', text: '' })
      }

      processId = ''
    }

    if (isIntent) {
      // data.meta.data?.reverse?.()
      addNormalMessage(data, { isIntent })
      return
    }

    if (isStream) {
      // Don't use trim.
      if (!data.text) return

      addStreamMessage(data)
      return
    }

    if (isNormal) {
      addTokenMessage(data)
      return
    }

    if (isInteractive) {
      addInteractiveMessage(data)
      return
    }

    if (isReference) {
      addReferenceMesssage(data)
      return
    }

    // Answer ended & include emotion & is not interactive message.
    const isNotInteractive = !last(messages)?.isInteractive
    if (isEnd && hasEmotion(meta) && isNotInteractive) {
      // TODO: Fix any type.
      emitMotionWithWisdom(meta.emotion as any)
    }
  }

  return {
    addMessage,
    addStreamMessage,
    addNormalMessage,
    addTokenMessage,
    addInteractiveMessage,
    addReferenceMesssage,
    addMonitorMessages,
    parseChatMessage,
    addLoading,
    removeLast,
    removeLastLoading,
    findPrevInteractive,
  }
}
