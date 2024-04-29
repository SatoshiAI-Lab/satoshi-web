import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import type { MonitorData } from '@/api/chat/types'

import { chatApi } from '@/api/chat'
import { useUserStore } from '@/stores/use-user-store'
import { useStorage } from './use-storage'
import { useWebSocket } from './use-websocket'
import { useChatStore } from '@/stores/use-chat-store'
import { useMessages } from './use-messages'

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

export const useChatMonitorMsg = () => {
  const { i18n } = useTranslation()
  const { getLoginToken } = useStorage()
  const { userInfo, isLogined } = useUserStore()
  const { setUnreadMessage, chatScrollToBottom } = useChatStore()
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
        setUnreadMessage([...useChatStore.getState().unreadMessages, ...data])
      } else {
        addMonitorMessages(data)
        chatScrollToBottom()
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
