import React from 'react'

import Header from '@/components/header'
import Favorites from '@/components/favorites'
import Chat from '@/components/chat'

export default function Home() {
  const bgSrc = 'https://img.mysatoshi.ai/backgrounds/bright-1.jpg'

  return (
    <main className="flex flex-col h-screen !overflow-hidden">
      <img
        src={bgSrc}
        className="fixed top-0 left-0 z-0 w-screen h-screen object-cover transition-all"
        alt="background image"
      />
      <Header />
      <div className="flex-1 flex relative z-10">
        <Chat className="flex-1" />
        <Favorites />
      </div>
    </main>
  )
}
