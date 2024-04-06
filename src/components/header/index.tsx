import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import { Button, Menu, MenuItem } from '@mui/material'
import { IoLanguageOutline } from 'react-icons/io5'
import { useTranslation } from 'react-i18next'
import { IoLogOutOutline } from 'react-icons/io5'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import toast from 'react-hot-toast'

import MobileHeader from './components/mobile'
import DesktopHeader from './components/desktop'
import CustomDropdown from '../custom-dropdown'
import LoginDialog from '../login-dialog'
import { Routes } from '@/routes'
import { useResponsive } from '@/hooks/use-responsive'
import { utilArr } from '@/utils/array'
import { useStorage } from '@/hooks/use-storage'
import { useThemeStore } from '@/stores/use-theme-store'
import { utilFmt } from '@/utils/format'
import { useUserStore } from '@/stores/use-user-store'

import type { CustomDropdownItem } from '../custom-dropdown/types'
import type { HeaderItem } from './types'

const Header = () => {
  const router = useRouter()
  const { isMobile, isDesktop } = useResponsive()
  const { t, i18n } = useTranslation()

  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const openLogoutWallet = Boolean(anchorEl)

  const langs = useMemo(() => {
    return Object.entries(i18n.options.resources ?? {}).map(([key, value]) => ({
      key: key,
      label: value.name as string,
    }))
  }, [])

  const handleLogoutClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCreatClose = () => {
    setAnchorEl(null)
  }

  const { getLang, setLang } = useStorage()
  const { userInfo, logout, fetchUserInfo } = useUserStore()
  const { isDark } = useThemeStore()

  const onLangChange = (item: CustomDropdownItem) => {
    const lang = String(item.key)

    i18n.changeLanguage(lang)
    setLang(lang)
  }

  const onItemClick = (item: HeaderItem) => {
    router.push(item.route)
  }

  const onLogout = () => {
    logout()
    handleCreatClose()
    toast.success(t('logout.success'))
  }

  useQuery({
    queryKey: [fetchUserInfo.name],
    queryFn: fetchUserInfo,
    refetchInterval: 15_000,
  })

  return (
    <div className={`sticky top-0 z-50`}>
      <div
        className={clsx(
          'h-header bg-header dark:bg-header-dark',
          'flex justify-between items-center z-10 relative',
          'max-sm:h-header-m'
        )}
      >
        <div className="flex items-center">
          {isMobile && <MobileHeader items={[]} onItemClick={onItemClick} />}
          <img
            src={isDark ? 'images/logos/white.png' : 'images/logos/black.png'}
            alt="logo"
            className={clsx(
              'max-w-logo cursor-pointer mt-3 mx-10',
              'max-sm:mt-4 max-sm:max-w-logo-m max-sm:ml-2'
            )}
            onClick={() => router.push(Routes.index)}
          />
          {isDesktop && <DesktopHeader items={[]} onItemClick={onItemClick} />}
        </div>
        <div className="flex items-center">
          {/* Language dropdown */}
          <CustomDropdown
            items={langs}
            active={getLang() ?? utilArr.first(langs).key}
            onItemClick={onLangChange}
          >
            <IoLanguageOutline
              size={22}
              className="text-black dark:text-white"
            />
          </CustomDropdown>
          {/* Login button */}
          {userInfo ? (
            <div className="mx-10" onClick={(e) => handleLogoutClick(e)}>
              <Button
                variant="outlined"
                classes={{
                  root: clsx(' max-sm:!mx-4'),
                }}
              >
                <span className="truncate max-w-[120px]">
                  {utilFmt.email(userInfo)}
                </span>
              </Button>
            </div>
          ) : (
            <Button
              variant="contained"
              color="primary"
              classes={{
                root: clsx('!mx-10 max-sm:!mx-4'),
              }}
              onClick={() => setOpen(true)}
            >
              {t('login.tosignin')}
            </Button>
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
            '!text-[#4b587cbc]'
          )}
        >
          <div className="w-full flex justify-between items-center text-[16px]">
            <span className="mr-2">{t('logout')}</span>
            <IoLogOutOutline />
          </div>
        </MenuItem>
      </Menu>
      <LoginDialog signin={true} open={open} onClose={() => setOpen(false)} />
    </div>
  )
}

export default Header
