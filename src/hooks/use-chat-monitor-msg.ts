import { chatApi } from '@/api/chat'
import { URL_CONFIG } from '@/config/url'
import { useUserStore } from '@/stores/use-user-store'
import { useEffect } from 'react'
import { useStorage } from './use-storage'
import { useWebSocket } from './use-websocket'

export const useChatMonitorMsg = () => {
  const { getLoginToken } = useStorage()
  const { userInfo, isLogined } = useUserStore()
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

    on('message', () => {
      
    })
  }

  useEffect(() => {
    if (isLogined) {
      inithMonitorReq()
    } else {
    }
  }, [isLogined])
}
