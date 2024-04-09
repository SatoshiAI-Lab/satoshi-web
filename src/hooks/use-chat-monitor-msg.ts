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
  const { setUnreadMessage } = useChatStore()
  const { addMonitorMessage } = useChat()
  const { setSocket } = useChatStore()
  const baseURL = `${URL_CONFIG.satoshiMonitorApi}/ws/chat/`

  const { connect, on } = useWebSocket({
    heartbeat: JSON.stringify({ type: 'ping' }),
  })

  const inithMonitorReq = async () => {
    if (!userInfo?.id) return

    const { data } = await chatApi.getMonitorRoomId(userInfo.id)
    const token = getLoginToken()
    const wssUrl = `${baseURL}${data.id}/?access_token=${token}`

    setSocket(await connect(wssUrl))

    on('message', () => {})

    on('event', ({ data }) => {
      console.log(`Keyup: ${useChatStore.getState().inputKeyup}`)
      console.log(`readAnswer: ${useChatStore.getState().readAnswer}`)
      console.log(`waitAnswer: ${useChatStore.getState().waitAnswer}`)

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
