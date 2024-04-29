import React from 'react'
import { useRouter } from 'next/navigation'
import { clsx } from 'clsx'

import { useThemeStore } from '@/stores/use-theme-store'
import { Routes } from '@/routes'

export const Logo = (props: React.ComponentProps<'img'>) => {
  const { className } = props
  const router = useRouter()
  const { isDark } = useThemeStore()

  return (
    <img
      src={isDark ? 'images/logos/white.png' : 'images/logos/black.png'}
      alt="logo"
      className={clsx('max-w-logo cursor-pointer', className)}
      onClick={() => router.push(Routes.index)}
    />
  )
}

export default Logo
