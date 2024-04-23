import React from 'react'
import { useRouter } from 'next/router'
import { clsx } from 'clsx'

import type { HeaderItem } from './types'

import { MobileHeader } from './mobile'
import { DesktopHeader } from './desktop'
import { Routes } from '@/routes'
import { useResponsive } from '@/hooks/use-responsive'
import { useThemeStore } from '@/stores/use-theme-store'
import { SocialLinks } from '../social-links'
import { LoginButtons } from '../login-buttons'
import { LangDropdown } from '../lang-dropdown'

interface Props extends React.ComponentProps<'div'> {}

export const Header = (props: Props) => {
  const { className } = props
  const router = useRouter()
  const { isMobile, isDesktop } = useResponsive()
  const { isDark } = useThemeStore()

  const items: HeaderItem[] = []

  const onItemClick = (item: HeaderItem) => {
    router.push(item.route)
  }

  return (
    <div className={clsx('sticky top-0 z-50', className)}>
      <div
        className={clsx(
          'h-header bg-header dark:bg-header-dark',
          'flex justify-between items-center z-10 relative',
          'max-md:h-header-m'
        )}
      >
        <div className="flex items-center">
          {isMobile && <MobileHeader items={items} onItemClick={onItemClick} />}
          <img
            src={isDark ? 'images/logos/white.png' : 'images/logos/black.png'}
            alt="logo"
            className={clsx(
              'max-w-logo cursor-pointer mt-3 mx-10',
              'max-sm:mt-4 max-sm:max-w-logo-m max-sm:ml-2'
            )}
            onClick={() => router.push(Routes.index)}
          />
          {isDesktop && (
            <DesktopHeader items={items} onItemClick={onItemClick} />
          )}
        </div>
        <div className="flex items-center">
          {/* Social links. */}
          <SocialLinks />
          {/* Language dropdown. */}
          <LangDropdown />
          {/* Login buttons. */}
          <LoginButtons />
        </div>
      </div>
    </div>
  )
}

export default Header
