import React from 'react'
import { useRouter } from 'next/router'
import { Button } from '@mui/material'

import { utilFmt } from '@/utils/format'
import { Routes } from '@/routes'
import { useResponsive } from '@/hooks/use-responsive'
import MobileHeader from './mobile'
import DesktopHeader from './desktop'

function Header() {
  const router = useRouter()
  const { isMobile, isDesktop } = useResponsive()
  const items = ['Satoshi', 'KLine']

  return (
    <div className={`sticky top-0 z-50`}>
      <div
        className={utilFmt.classes(
          'h-header bg-header dark:bg-header-dark',
          'flex justify-between items-center z-10 relative',
          'max-sm:h-header-m'
        )}
      >
        <div className="flex items-center">
          {isMobile && <MobileHeader items={items} />}
          <img
            src={'images/logos/white.png'}
            alt="logo"
            className={utilFmt.classes(
              'max-w-logo cursor-pointer mt-3 mx-10',
              'max-sm:mt-4 max-sm:max-w-logo-m max-sm:ml-2'
            )}
            onClick={() => router.push(Routes.index)}
          />
          {isDesktop && <DesktopHeader items={items} />}
        </div>

        <Button
          variant="contained"
          color="primary"
          classes={{
            root: utilFmt.classes('!mx-10 max-sm:!mx-4'),
          }}
        >
          login
        </Button>
      </div>
    </div>
  )
}

export default Header
