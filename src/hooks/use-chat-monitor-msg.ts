import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { nanoid } from 'nanoid'

import { AnswerType, type MonitorData } from '@/api/chat/types'

import { chatApi } from '@/api/chat'
import { useUserStore } from '@/stores/use-user-store'
import { useStorage } from './use-storage'
import { useWebSocket } from './use-websocket'
import { useChatStore } from '@/stores/use-chat-store'
import { utilDom } from '@/utils/dom'
import { useMessages } from './use-messages'
import { Message } from '@/stores/use-chat-store/types'

interface MonitorOnEvents {
  event: {
    type: string
    data: MonitorData[]
  }
}

interface MonitorEmitEvents {
  lang: {
    lang: string
  }
}

// TODO: Optimize this, unread message is also message,
// Should be use likely `addMessage` methods.
const makeUnreadMessage = (data: MonitorData) => {
  return {
    id: nanoid(),
    role: 'assistant',
    text: '',
    answer_type: AnswerType.WsMonitor,
    hyper_text: '',
    meta: {
      type: data.data_type,
      data: data,
    },
  } as Message
}

export const useChatMonitorMsg = () => {
  const { i18n } = useTranslation()
  const { getLoginToken } = useStorage()
  const { userInfo, isLogined } = useUserStore()
  const { chatEl, setUnreadMessage } = useChatStore()
  // const { addMonitorMessage } = useChatMigrating()
  const { addMonitorMessages } = useMessages()
  const ws = useWebSocket<MonitorOnEvents, MonitorEmitEvents>({
    heartbeat: JSON.stringify({ type: 'ping' }),
  })
  const baseURL = `${process.env.NEXT_PUBLIC_SATOSHI_MONITOR_API}/ws/chat/`

  const inithMonitorReq = async () => {
    if (!userInfo?.id) return

    const { data } = await chatApi.getMonitorRoomId(userInfo.id)
    const token = getLoginToken()
    const wssUrl = `${baseURL}${data.id}/?access_token=${token}`

    await ws.connect(wssUrl)

    ws.on('event', ({ data }) => {
      data = data.reverse()

      console.log(`Keyup: ${useChatStore.getState().inputKeyup}`)
      console.log(`readAnswer: ${useChatStore.getState().readAnswer}`)
      console.log(`waitAnswer: ${useChatStore.getState().waitAnswer}`)

      if (!isLogined) {
        ws.disconnect()
        return
      }

      // 1. Within 20 seconds after the input is in the state of Keyup
      // 2. Within 20 seconds after the latest question answer
      // 3. Within 10 seconds after the user clicks Ask
      // should no be boxing
      if (
        useChatStore.getState().unreadMessages.length ||
        useChatStore.getState().inputKeyup ||
        useChatStore.getState().readAnswer ||
        useChatStore.getState().waitAnswer
      ) {
        setUnreadMessage([
          ...useChatStore.getState().unreadMessages,
          ...data.map((d) => makeUnreadMessage(d)),
        ])
      } else {
        addMonitorMessages(data)
        chatEl && utilDom.scrollToBottom(chatEl)
      }
    })
  }

  useEffect(() => {
    ws.emit('lang', i18n.language)
  }, [i18n.language])

  useEffect(() => {
    if (isLogined) {
      inithMonitorReq()
    } else {
      ws.disconnect()
    }

    return ws.disconnect
  }, [isLogined, userInfo?.id])
}
