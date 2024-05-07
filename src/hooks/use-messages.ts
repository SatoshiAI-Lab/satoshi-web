import { nanoid } from 'nanoid'
import { last } from 'lodash'

import type { Message } from '@/stores/use-chat-store/types'
import {
  type MonitorData,
  type ChatResponse,
  AnswerType,
  MetaType,
} from '@/api/chat/types'

import { useChatStore } from '@/stores/use-chat-store'

export const useMessages = () => {
  const { getMessages, addMessage, updateMessage, removeMessage } =
    useChatStore()

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

  // Create a message manager.
  const createMessageManage = () => {
    let message: Message = {
      id: nanoid(),
      role: 'assistant',
      text: '',
    }

    const add = (data: ChatResponse, override = false) => {
      // If is exist update it, else add a new one.
      const isExisted = getMessages().find((m) => m.id === message.id)
      if (isExisted) return update(data, override)

      addMessage({ ...message, ...data })
    }

    const addNew = (data: ChatResponse) => {
      message = {
        id: nanoid(),
        role: 'assistant',
        text: '',
      }
      add(data)
    }

    const update = (data: ChatResponse, override = false) => {
      updateMessage(message.id, (m) => ({
        ...m,
        ...data,
        // If `data.hyper_text` is empty, then use `m.hyper_text`.
        hyper_text: data.hyper_text || m.hyper_text,
        text: override ? data.text : m.text + data.text,
      }))
    }

    const remove = () => {
      if (!message.id) return

      removeMessage(message.id)
      message = {
        id: '',
        role: 'assistant',
        hyper_text: '',
        text: '',
      }
    }

    return {
      add,
      addNew,
      remove,
    }
  }

  // Create process message manager.
  const createProcessManage = () => {
    let shouldBeRemove = false
    const { add, remove } = createMessageManage()

    return {
      addProcess: add,
      removeProcess: remove,
      shouldRemoveProcess: () => shouldBeRemove,
      markedRemoveProcess: () => (shouldBeRemove = true),
    }
  }

  // Add a clear context history message.
  const addClearHistoryMessage = () => {
    addMessage({
      role: 'system',
      text: '',
      isSystem: true,
      meta: {
        type: MetaType.ClearHistory,
        data: {},
      },
    })
  }

  return {
    // Store methods.
    getMessages,
    addMessage,
    updateMessage,
    removeMessage,

    // Hook methods.
    addLoading,
    removeLastLoading,
    findPrevInteractive,
    addMonitorMessages,
    createMessageManage,
    createProcessManage,
    addClearHistoryMessage,
  }
}
