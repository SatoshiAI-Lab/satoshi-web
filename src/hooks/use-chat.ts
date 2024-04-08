import toast from 'react-hot-toast'

import { chatApi } from '@/api/chat'
import { useChatStore } from '@/stores/use-chat-store'
import { useLive2DStore } from '@/stores/use-live2d-store'
import { utilParse } from '@/utils/parse'
import { CHAT_CONFIG } from '@/config/chat'
import { ChatParams, ChatResponseAnswer } from '@/api/chat/types'
import { useTranslation } from 'react-i18next'
import { useNeedLoginStore } from '@/stores/use-need-login-store'
import { useRef } from 'react'
import { useHyperTextParser } from './use-hyper-text-parser'
import { utilDom } from '@/utils/dom'
import i18n from '@/i18n'
import { nanoid } from 'nanoid'
import {
  InteractiveMessageOptions,
  Message,
} from '@/stores/use-chat-store/types'

export const useChat = () => {
  const { t } = useTranslation()
  const { setShow } = useNeedLoginStore()

  const isReceiving = useRef(false)
  const thinkTimer = useRef<NodeJS.Timeout>()
  const hasSmooth = useRef(false)
  const controller = useRef<AbortController>()

  const chatStore = useChatStore()
  const { setQuestion, setIsLoading, setMessage, setWaitAnswer, setIntention } =
    chatStore

  /**
   * Adds a new message to the message data
   * @param msgs New Message
   */
  const addMessage = (msgs: Message | Message[]) => {
    if (!Array.isArray(msgs)) msgs = [msgs]

    msgs.map((m) => (m.msgId = nanoid()))

    const { chatEl, messages } = useChatStore.getState()

    setMessage([...messages, ...(msgs as Message[])])

    // Do no show monitor message within 20 seconds
    setWaitAnswer(true)
    console.log('user start reading answer now')
    setTimeout(function () {
      setWaitAnswer(false)
      console.log('user stop reading answer now')
    }, 20000)
    utilDom.scrollToBottom(chatEl!)
  }

  const addMonitorMessage = (msg: Message | Message[]) => {
    addMessage(msg)
  }

  /**
   * Add general Q&A information
   * @param content User or AI text
   * @param ops Configure the text rendering form
   * @returns
   */
  const addStreamMessage = (content: string, ops?: Omit<Message, 'msg'>) => {
    const { messages } = useChatStore.getState()
    const lastMessage = messages[messages.length - 1]
    const newMsg: Message = {
      ...lastMessage,
      msg: lastMessage.msg + content,
      isLoadingMsg: false,
      msgId: nanoid(),
    }
    const { reference } = CHAT_CONFIG.answerType

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

    if (!lastMessage) return { messages: [...messages] }

    setMessage([...messages.slice(0, messages.length - 1), newMsg])
    // Do no show monitor message within 20 seconds
    setWaitAnswer(true)
    console.log('user start waiting answer now')
    setTimeout(function () {
      setWaitAnswer(false)
      console.log('user stop waiting answer now')
    }, 20000)
    const { chatEl } = useChatStore.getState()

    utilDom.scrollToBottom(chatEl!)
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
    } = CHAT_CONFIG.answerType

    console.log('Chat Data: ', data)

    const messages = chatStore.messages
    const answerType = data.answer_type
    const isIntention = answerType.startsWith(intentStream)

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

    if (intention.includes(answerType) || isIntention) {
      if (data.text && !hiddenIntentText.includes(data?.meta.type!)) {
        addStreamMessage(data.text)
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
      const data = await reader?.read()

      hasSmooth.current = false

      // clear status
      if (data?.done) {
        controller.current?.abort()
        resetSomeState()
        break
      }

      // parsing streaming string
      utilParse.parseStreamString(data?.value!, messageHandler)
    }
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
    addMessageAndLoading,
    addMonitorMessage,
  }
}
