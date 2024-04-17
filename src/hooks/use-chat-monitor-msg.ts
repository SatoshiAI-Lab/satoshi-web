import { useEffect } from 'react'

import { chatApi } from '@/api/chat'
import { URL_CONFIG } from '@/config/url'
import { useUserStore } from '@/stores/use-user-store'
import { useStorage } from './use-storage'
import { useWebSocket } from './use-websocket'
import { useChatStore } from '@/stores/use-chat-store'
import { useChatMigrating } from './use-chat-migrating'
import { useMessages } from './use-messages'
import { utilDom } from '@/utils/dom'

interface MonitorOnEvents {
  event: {
    type: string
    data: any
  }
}

interface MonitorEmitEvents {
  lang: {
    lang: string
  }
}

export const useChatMonitorMsg = () => {
  const { getLoginToken } = useStorage()
  const { userInfo, isLogined } = useUserStore()
  const { chatEl, setUnreadMessage } = useChatStore()
  // const { addMonitorMessage } = useChatMigrating()
  const { addMonitorMessages } = useMessages()
  const ws = useWebSocket<MonitorOnEvents, MonitorEmitEvents>({
    heartbeat: JSON.stringify({ type: 'ping' }),
  })
  const baseURL = `${URL_CONFIG.satoshiMonitorApi}/ws/chat/`

  const inithMonitorReq = async () => {
    if (!userInfo?.id) return

    const { data } = await chatApi.getMonitorRoomId(userInfo.id)
    const token = getLoginToken()
    const wssUrl = `${baseURL}${data.id}/?access_token=${token}`

    await ws.connect(wssUrl)

    ws.on('event', ({ data }) => {
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
          ...data.reverse(),
        ])
      } else {
        addMonitorMessages(data.reverse())
        chatEl && utilDom.scrollToBottom(chatEl)
      }
    })
  }

  useEffect(() => {
    if (isLogined) {
      inithMonitorReq()
    } else {
      ws.disconnect()
    }

    return ws.disconnect
  }, [isLogined, userInfo?.id])
}
