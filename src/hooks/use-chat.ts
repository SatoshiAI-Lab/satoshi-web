import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { nanoid } from 'nanoid'
import toast from 'react-hot-toast'

import { chatApi } from '@/api/chat'
import { useChatStore } from '@/stores/use-chat-store'
import { useLive2DStore } from '@/stores/use-live2d-store'
import { utilParse } from '@/utils/parse'
import { CHAT_CONFIG } from '@/config/chat'
import { ChatParams, ChatResponseAnswer } from '@/api/chat/types'
import { useNeedLoginStore } from '@/stores/use-need-login-store'
import { useHyperTextParser } from './use-hyper-text-parser'
import { utilDom } from '@/utils/dom'
import i18n from '@/i18n'

import type {
  InteractiveMessageOptions,
  Message,
} from '@/stores/use-chat-store/types'

interface StreamOptions extends Omit<Message, 'msg'> {
  // Use new content to override old content, instead of append.
  overrideMode?: boolean
}

export const useChat = () => {
  const { t } = useTranslation()
  const { setShow } = useNeedLoginStore()
  const isReceiving = useRef(false)
  const thinkTimer = useRef<NodeJS.Timeout>()
  const hasSmooth = useRef(false)
  const controller = useRef<AbortController>()
  const chatStore = useChatStore()
  const {
    chatEl,
    setQuestion,
    setIsLoading,
    setMessage,
    setWaitAnswer,
    setReadAnswer,
    setIntention,
  } = chatStore

  const scrollToChatBottom = () => {
    if (chatEl) utilDom.scrollToBottom(chatEl)
  }

  const addMessage = (msgs: Message | Message[]) => {
    if (!Array.isArray(msgs)) msgs = [msgs]

    msgs.map((m) => (m.msgId = nanoid()))

    const { chatEl, messages } = useChatStore.getState()

    setMessage([...messages, ...(msgs as Message[])])

    utilDom.scrollToBottom(chatEl!)
  }

  const addMonitorMessage = (msg: Message | Message[]) => {
    if (Array.isArray(msg)) {
      msg.forEach((msg) => {
        addMessage({
          ...msg,
          isMonitor: true,
        })
      })
      return
    }

    addMessage({
      ...msg,
      isMonitor: true,
    })
  }

  const addStreamMessage = (content: string, ops?: StreamOptions) => {
    const { messages } = useChatStore.getState()
    const lastMessage = messages[messages.length - 1]
    const msg = ops?.overrideMode ? content : lastMessage.msg + content
    const newMsg: Message = {
      ...ops,
      ...lastMessage,
      msg,
      isLoadingMsg: false,
      msgId: nanoid(),
    }
    const { reference } = CHAT_CONFIG.answerType

    // Is reference message.
    if (ops?.rawData?.answer_type === reference) {
      const { type, content, published_at, url } = ops.rawData.meta
      const parsedContent = content?.replaceAll('\n', '<br />')

      // Must be complete tag
      const refTag = `
          <${reference} 
            type=\"${type}\"
            published_at=\"${published_at}\" 
            url=\"${url}\"
          >${parsedContent}</${reference}>
        `
      newMsg.msg = newMsg.msg + refTag
    }

    if (!lastMessage) return newMsg

    setMessage([...messages.slice(0, messages.length - 1), newMsg])
    const { chatEl } = useChatStore.getState()

    utilDom.scrollToBottom(chatEl!)

    return newMsg
  }

  const addMessageAndLoading = (msg: Message) => {
    const loadingMsg = {
      msg: '',
      isLoadingMsg: true,
    }

    addMessage([msg, loadingMsg])
  }

  const removeLoadingMessage = () => {
    const { messages } = useChatStore.getState()
    const nonLoading = messages.filter((e) => !e.isLoadingMsg)
    setMessage(nonLoading)
  }

  const cancelAnswer = () => {
    resetSomeState()
    hasSmooth.current = true
    controller.current?.abort()
    toast(t('cancel-answer'))
  }

  const findPrevInteractive = (id?: string) => {
    if (!id || !id.trim()) return

    const { messages } = useChatStore.getState()
    let m = messages.findIndex((m) => m.msgId === id)
    let msg: Message | undefined

    while (msg?.position !== 'right' && m !== -1) {
      m -= 1
      msg = messages[m]
    }

    return msg
  }

  const getParams = (opts?: InteractiveMessageOptions) => {
    const { question } = useChatStore.getState()
    const { language } = i18n
    const params: ChatParams = {
      question,
      user_info: {
        username: 'anonymous',
        is_vip: true,
        preference: { language },
        favorite: {},
      },
      history: [],
      stream: CHAT_CONFIG.useStream,
    }

    // multi interactive
    if (opts?.selected_entities) {
      params.selected_entities = opts.selected_entities
      params.question = opts.question
    } else if (opts) {
      // normal interactive
      params.id = opts.id
      params.type = opts.type
      params.question = opts.question
    }

    return params
  }

  const resetSomeState = () => {
    clearInterval(thinkTimer.current)
    removeLoadingMessage()
    setIsLoading(false)
    isReceiving.current = false
    hasSmooth.current = true
  }

  const handleNormalMessage = (data: ChatResponseAnswer) => {
    const [toHTMLTag] = useHyperTextParser(CHAT_CONFIG.hyperTextRule)
    removeLoadingMessage()
    addMessage({
      msg: toHTMLTag(data.hyper_text).trim() + '\n\n',
      type: data.answer_type,
    })
  }

  /**
   * Processing presentation of different types of data
   * @param data The data returned by AI
   * @returns
   */
  const messageHandler = (data: ChatResponseAnswer) => {
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
      process,
    } = CHAT_CONFIG.answerType

    if (data.answer_type === 'end') {
      setReadAnswer(true)
      console.log('user start reading answer now!!!')
      setTimeout(function () {
        setReadAnswer(false)
        console.log('user stop reading answer now!!!')
      }, 10000)
    }

    const messages = chatStore.messages
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
      messages.pop()
      return
    }

    // Is processing.
    if (answerType === process) {
      addStreamMessage(data.text, { overrideMode: true })
      return
    }

    // Override `process_stream` message.
    addStreamMessage('', { overrideMode: true })

    if (
      intention.includes(answerType) ||
      isIntention ||
      intention.includes(metaType ?? '') // create token message
    ) {
      if (data.text && !hiddenIntentText.includes(data?.meta.type!)) {
        addStreamMessage(data.text, { msgs: data.meta })
      }

      data.meta.data?.reverse?.()

      addMessage({
        msg: '[should be intention]',
        msgs: data.meta,
        isIntention: true,
        type: answerType,
      })
      return
    }

    // streaming answer
    if (streams.includes(answerType)) {
      if (!data.text)
        // Don't use trim
        return

      addStreamMessage(data.text)
      return
    }

    // non streaming answer
    if (normals.includes(answerType)) {
      handleNormalMessage(data)
      return
    }

    // interactive answer
    if (answerType === interactive) {
      removeLoadingMessage()
      addMessage({
        msg: '[should be interactive]',
        msgs: data.meta,
        isInteractive: true,
        type: answerType,
      })
      return
    }

    // origin reference
    if (answerType === reference) {
      addStreamMessage(data.text, { rawData: data, type: answerType })
      return
    }

    // answer ended, include emotion
    if (answerType === end) {
      const isInteractive = messages[messages.length - 1]?.isInteractive

      if (isInteractive) return
      // answer must not be interactive
      useLive2DStore.getState().handleEmotion(data.meta.emotion)
    }

    return
  }

  /**
   * Processing stream data
   * @param response Data stream
   */
  const messageParser = async (response: ReadableStream<Uint8Array>) => {
    const reader = response.pipeThrough(new TextDecoderStream()).getReader()

    isReceiving.current = true
    while (isReceiving) {
      if (!isReceiving) {
        controller.current?.abort()
        break
      }
      const { done, value = '' } = await reader?.read()

      hasSmooth.current = false

      // clear status
      if (done) {
        controller.current?.abort()
        resetSomeState()
        break
      }

      // Too large response data, in general is not stream data.
      if (CHAT_CONFIG.largeDataType.some((s) => value.includes(s))) {
        handleLarge(reader, value)
        break
      }

      // parsing streaming string
      utilParse.parseStreamString(value, messageHandler)
    }
  }

  const handleLarge = async (
    reader: ReadableStreamDefaultReader<string>,
    prevStr: string
  ) => {
    console.log('large data', prevStr)

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      prevStr += value
    }

    utilParse.parseStreamString(prevStr, messageHandler)
    resetSomeState()
  }

  const sendMsg = async (opts?: InteractiveMessageOptions) => {
    const { model, speakAndMotion } = useLive2DStore.getState()
    const params = getParams(opts)
    const timer = setInterval(() => model?.motion('Thinking', 0, 2))

    params.intent_stream = useChatStore.getState().intention

    clearInterval(thinkTimer.current)
    setIsLoading(true)
    setQuestion('')
    setIntention('')
    speakAndMotion('Thinking')
    // If answer too long, loop thinking. but
    thinkTimer.current = timer

    try {
      controller.current = new AbortController()
      const response = await chatApi.chat(params, controller.current.signal)
      return messageParser(response)
    } catch (e: any) {
      console.error('[CHAT ERROR]: ', e)

      // Handle users not logging in to access services
      if (e?.status == 401) {
        setShow(true)
        toast.error(t('need.login'))
      } else if (String(e).includes('AbortError')) {
        // Don't shwo AbortError
      } else {
        toast.error(String(e))
      }

      setIsLoading(false)
      removeLoadingMessage()
    }
  }

  return {
    ...chatStore,
    isReceiving,
    hasSmooth,
    sendMsg,
    cancelAnswer,
    findPrevInteractive,
    addMessage,
    addMessageAndLoading,
    addMonitorMessage,
    scrollToChatBottom,
  }
}
