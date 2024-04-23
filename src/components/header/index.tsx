import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Button, Menu, MenuItem } from '@mui/material'
import { IoLanguageOutline } from 'react-icons/io5'
import { useTranslation } from 'react-i18next'
import { IoLogOutOutline } from 'react-icons/io5'
import { clsx } from 'clsx'
import { toast } from 'react-hot-toast'

import type { CustomDropdownItem } from '../custom-dropdown/types'
import type { HeaderItem } from './types'

import { MobileHeader } from './components/mobile'
import { DesktopHeader } from './components/desktop'
import { CustomDropdown } from '../custom-dropdown'
import { LoginDialog } from '../login-dialog'
import { Routes } from '@/routes'
import { useResponsive } from '@/hooks/use-responsive'
import { useStorage } from '@/hooks/use-storage'
import { useThemeStore } from '@/stores/use-theme-store'
import { useUserStore } from '@/stores/use-user-store'
import { useShow } from '@/hooks/use-show'
import { utilFmt } from '@/utils/format'
import { useChatStore } from '@/stores/use-chat-store'
import { resources } from '@/i18n'
import { SocialLinks } from '../social-links'

const langs = Object.entries(resources).map(([key, val]) => ({
  key: key,
  label: val.name as string,
}))

export const Header = () => {
  const router = useRouter()
  const { isMobile, isDesktop } = useResponsive()
  const { getLang, setLang } = useStorage()
  const { t, i18n } = useTranslation()
  const [isSignIn, setSignInStatus] = useState(true)
  const { show, open, hidden } = useShow()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openLogoutWallet = Boolean(anchorEl)
  const { socket, setMessages } = useChatStore()
  const { isLogined, userInfo, logout, fetchUserInfo } = useUserStore()
  const { isDark } = useThemeStore()

  const items: HeaderItem[] = []

  const handleLogoutClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCreatClose = () => {
    setAnchorEl(null)
  }

  const onLangChange = (item: CustomDropdownItem) => {
    const lang = String(item.key)

    if (i18n.language === lang) return

    i18n.changeLanguage(lang)
    setLang(lang)
  }

  const onItemClick = (item: HeaderItem) => {
    router.push(item.route)
  }

  const onLogout = () => {
    socket?.close(1000)
    // if (socket?.CLOSED == 3) {
    logout()
    setMessages([])
    handleCreatClose()
    toast.success(t('logout.success'))
    // }
  }

  const changeStatus = (status: boolean) => {
    setSignInStatus(status)
    open()
  }

  useEffect(() => {
    fetchUserInfo()
  }, [])

  return (
    <div className={`sticky top-0 z-50`}>
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
          <CustomDropdown
            items={langs}
            active={getLang() || 'en'}
            onItemClick={onLangChange}
          >
            <IoLanguageOutline
              size={22}
              className="text-black dark:text-white"
            />
          </CustomDropdown>
          {/* Login button */}
          {isLogined ? (
            <div className="ml-4 mr-10" onClick={(e) => handleLogoutClick(e)}>
              <Button
                variant="contained"
                classes={{
                  root: clsx(' max-sm:!mx-4 !rounded-full'),
                }}
              >
                <span className="truncate max-w-[120px] ">
                  {utilFmt.email(userInfo?.email)}
                </span>
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="text"
                color="primary"
                classes={{
                  root: clsx(
                    '!ml-10 !mr-2 max-sm:!mx-4 !rounded-full !text-black dark:!text-white'
                  ),
                }}
                onClick={() => changeStatus(true)}
              >
                {t('login.tosignin')}
              </Button>
              <Button
                variant="contained"
                color="primary"
                classes={{
                  root: clsx('!mr-10 max-sm:!mx-4 !rounded-full'),
                }}
                onClick={() => changeStatus(false)}
              >
                {t('register')}
              </Button>
            </>
          )}
        </div>
      </div>
      <Menu
        anchorEl={anchorEl}
        open={openLogoutWallet}
        onClose={handleCreatClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        classes={{
          root: 'mt-2',
          list: '!p-[0px]',
        }}
      >
        <MenuItem
          onClick={onLogout}
          className={clsx(
            'flex flex-col !items-start !justify-center',
            '!text-zinc-600 dark:!text-gray-300'
          )}
        >
          <div className="w-full flex justify-between items-center text-[16px]">
            <span className="mr-2">{t('logout')}</span>
            <IoLogOutOutline />
          </div>
        </MenuItem>
      </Menu>
      <LoginDialog signin={isSignIn} open={show} onClose={hidden} />
    </div>
  )
}

export default Header
