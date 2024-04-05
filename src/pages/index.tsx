import React from 'react'

import Header from '@/components/header'
import Favorites from '@/components/favorites'
import Chat from '@/components/chat'
import { useBackground } from '@/hooks/use-background'

export default function Home() {
  const { src, blurStyle } = useBackground(true)

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
    </main>
  )
}
