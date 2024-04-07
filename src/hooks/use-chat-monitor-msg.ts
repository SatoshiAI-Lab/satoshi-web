import { chatApi } from '@/api/chat'
import { URL_CONFIG } from '@/config/url'
import { useUserStore } from '@/stores/use-user-store'
import { useEffect } from 'react'
import { useStorage } from './use-storage'
import { useWebSocket } from './use-websocket'
import { useChatStore } from '@/stores/use-chat-store'
import { Message } from '@/stores/use-chat-store/types'
import { useChat } from './use-chat'

export const useChatMonitorMsg = () => {
  const { getLoginToken } = useStorage()
  const { userInfo, isLogined } = useUserStore()
  const { setUnreadMessage, inputFocus, readAnswer, waitAnswer } =
    useChatStore()
  const { addMonitorMessage } = useChat()
  const baseURL = `${URL_CONFIG.satoshiMonitorApi}/ws/chat/`

  const { connect, on } = useWebSocket({
    heartbeat: JSON.stringify({ type: 'ping' }),
  })

  const inithMonitorReq = async () => {
    if (!userInfo?.id) return

    const { data } = await chatApi.getMonitorRoomId(userInfo.id)
    const token = getLoginToken()
    const wssUrl = `${baseURL}${data.id}/?access_token=${token}`

    connect(wssUrl)

    on('message', () => {})

    on('event', ({ data }) => {
      // 1. If the question input is in the state of Focus
      // 2. Within 20 seconds after the latest question answer
      // 3. Within 10 seconds after the user clicks Ask
      // should no be godown
      if (
        useChatStore.getState().inputFocus ||
        useChatStore.getState().readAnswer ||
        useChatStore.getState().waitAnswer
      ) {
        setUnreadMessage(data.reverse())
      } else {
        addMonitorMessage(data.reverse())
      }
    })
  }

  useEffect(() => {
    if (isLogined) {
      inithMonitorReq()
    } else {
    }
  }, [isLogined])
}
