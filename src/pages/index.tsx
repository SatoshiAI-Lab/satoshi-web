import React, { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

import { Header } from '@/components/header'
import { Favorites } from '@/components/favorites'
import { Chat } from '@/components/chat'
import { useBackground } from '@/hooks/use-background'
import { LoginAuthDialog } from '@/components/login-auth-dialog'
import { useLoginAuthStore } from '@/stores/use-need-login-store'
import { useChatMonitorMsg } from '@/hooks/use-chat-monitor-msg'
import { useMonitorStore } from '@/stores/use-monitor-store'
import { monitorApi } from '@/api/monitor'
import { useUserStore } from '@/stores/use-user-store'
import { useWalletList } from '@/hooks/use-wallet-list'

export default function Home() {
  const { src, blurStyle } = useBackground(true)
  const { show, setShow } = useLoginAuthStore()
  const { isLogined } = useUserStore()
  const { timerByUpdate } = useMonitorStore()
  const { getAllWallet } = useWalletList({
    enabled: true,
    // Refresh wallet list every 15s.
    refetchInterval: 15_000,
  })

  useChatMonitorMsg()

  // Refresh monitor config every 15s.
  useQuery({
    queryKey: [monitorApi.getConfig.name, isLogined],
    queryFn: async () => {
      if (!isLogined) return null

      const { data } = await monitorApi.getConfig()
      timerByUpdate(data)

      return data
    },
    refetchInterval: 15_000,
  })

  useQuery({
    queryKey: [getAllWallet.name],
    queryFn: getAllWallet,
    refetchInterval: 15_000,
  })

  return (
    <main className="flex flex-col h-screen !overflow-hidden">
      <img
        src={src}
        style={blurStyle}
        className="fixed top-0 left-0 z-0 w-screen h-screen object-cover transition-all"
        alt="background image"
      />
      <Header />
      <div className="flex-1 flex relative z-10">
        {/* Chat main component, cointains Live2D model */}
        <Chat className="flex-1" />
        {/* User Favorites panel */}
        <Favorites />
      </div>
      <LoginAuthDialog show={show} onClose={() => setShow(false)} />
    </main>
  )
}
