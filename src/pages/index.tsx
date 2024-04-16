import React, { useEffect } from 'react'

import Header from '@/components/header'
import Favorites from '@/components/favorites'
import Chat from '@/components/chat'
import { useBackground } from '@/hooks/use-background'
import { LoginAuthDialog } from '@/components/login-auth-dialog'
import { useNeedLoginStore } from '@/stores/use-need-login-store'
import { useChatMonitorMsg } from '@/hooks/use-chat-monitor-msg'
import { useMonitorStore } from '@/stores/use-monitor-store'
import { useQuery } from '@tanstack/react-query'
import { monitorApi } from '@/api/monitor'
import { useUserStore } from '@/stores/use-user-store'
import { useWallet } from '@/hooks/use-wallet'
import { walletApi } from '@/api/wallet'
import { useWalletStore } from '@/stores/use-wallet-store'

export default function Home() {
  const { src, blurStyle } = useBackground(true)
  const { show, setShow } = useNeedLoginStore()
  const { isLogined } = useUserStore()
  const { selectedChain, setWallets } = useWalletStore()
  const { timerByUpdate } = useMonitorStore()

  const { getAllWallet } = useWallet()

  useChatMonitorMsg()

  const { data: walletsData } = useQuery({
    refetchInterval: 15_000,
    queryKey: [`${walletApi.getWallets.name}-refresh`, selectedChain],
    queryFn: () => walletApi.getWallets(selectedChain),
  })

  useQuery({
    queryKey: [monitorApi.getConfig.name, isLogined],
    queryFn: async () => {
      if (!isLogined) {
        return Promise.resolve()
      }
      const { data } = await monitorApi.getConfig()
      timerByUpdate(data)
      return data
    },
    refetchInterval: 15_000,
  })

  useEffect(() => {
    if (walletsData?.data) setWallets(walletsData.data)
  }, [walletsData])

  useEffect(() => {
    getAllWallet()
  }, [])

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
      <LoginAuthDialog
        show={show}
        onClose={() => setShow(false)}
      ></LoginAuthDialog>
    </main>
  )
}
