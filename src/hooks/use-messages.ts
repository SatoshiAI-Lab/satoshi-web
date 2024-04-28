import { nanoid } from 'nanoid'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'

import type { Message } from '@/stores/use-chat-store/types'

import { useChatStore } from '@/stores/use-chat-store'
import { utilArr } from '@/utils/array'
import { CHAT_CONFIG } from '@/config/chat'
import { ChatResponse } from '@/api/chat/types'
import { useLoginAuthStore } from '@/stores/use-need-login-store'
import { useLive2D } from './use-live2d'
import { useHypertext } from './use-hyper-text-parser'

/**
 * Messages management hook. base API:
 **/
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

  // Remove latest message.
  const removeLast = () => {
    const lastId = utilArr.last(getMessages())?.id

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
    const lastId = utilArr.last(loadings)?.id

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
    const last = utilArr.last(getMessages())

    if (!last) return
    const newMessage: Message = {
      ...data,
      ...last,
      ...m,
      role: 'assistant',
      text: overrideText ? data.text : last.text + data.text,
    }

    updateMessage(last.id, newMessage)
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
  const addMonitorMessages = (messages: Message[]) => {
    messages.forEach((m) => addMessage({ ...m, isMonitor: true }))
  }

  let processId = ''
  // Parseing & render message, by chat `answer_type` or `meta.type`.
  const parseChatMessage = (
    data: ChatResponse,
    isFirstRead: boolean,
    isFirstParse: boolean
  ) => {
    const {
      answer_type: answerType,
      meta: { type: metaType, status: answerStatus },
    } = data
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

    if (isFirstRead) {
      removeLastLoading()
      // on first read, add a blank message,
      // used for process message fill it.
      addMessage({ text: '' })
    }

    // Is end message.
    const isEnded = data.answer_type === 'end'
    if (isEnded) {
      setReadAnswer(true)
      setTimeout(function () {
        setReadAnswer(false)
      }, 10000)
    }

    // Is intention message, save the intention.
    const isIntention = answerType.startsWith(intentStream)
    if (isIntention) {
      setIntention(answerType!)
    }

    // Should be login.
    const shouldAuth = answerStatus === 401
    if (shouldAuth) {
      toast.error(t('need.login'))
      setShow(true)
      return
    }

    // Is null message, remove null.
    const isNull = answerType.includes(hide)
    if (isNull) {
      removeLast()
      return
    }

    // Is process hints message.
    const isProcess = answerType === 'process_stream'
    if (isProcess) {
      if (!processId) processId = nanoid()
      addStreamMessage(data, { id: processId }, true)
      return
    }

    const isStream = answerType.includes('stream')
    const isNotStream = !isStream
    if (processId) {
      // Is stream message, clear process message.
      if (isStream) updateMessage(processId, { text: '' })
      // Is not stream message, remove process message.
      else if (isNotStream) removeMessage(processId)

      processId = ''
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

    if (isStream) {
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

  return {
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
