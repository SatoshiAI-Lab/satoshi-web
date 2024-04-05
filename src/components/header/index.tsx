import React, { useMemo } from 'react'
import { useRouter } from 'next/router'
import { Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { IoLanguageOutline } from 'react-icons/io5'

import MobileHeader from './components/mobile'
import DesktopHeader from './components/desktop'
import CustomDropdown from '../custom-dropdown'
import { utilFmt } from '@/utils/format'
import { Routes } from '@/routes'
import { useResponsive } from '@/hooks/use-responsive'
import { resources } from '@/i18n'
import { useStorage } from '@/hooks/use-storage'
import { utilArr } from '@/utils/array'
import { useThemeStore } from '@/stores/use-theme-store'

import type { CustomDropdownItem } from '../custom-dropdown/types'

function Header() {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const { isMobile, isDesktop } = useResponsive()
  const { isDark } = useThemeStore()
  const { getLang, setLang } = useStorage()
  const langs = useMemo(() => {
    return Object.entries(resources ?? {}).map(([key, value]) => ({
      key: key,
      label: value.name as string,
    }))
  }, [])

  const onLangChange = (item: CustomDropdownItem) => {
    const lang = String(item.key)

    i18n.changeLanguage(lang)
    setLang(lang)
  }

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
          {isMobile && <MobileHeader items={[]} />}
          <img
            src={isDark ? 'images/logos/white.png' : 'images/logos/black.png'}
            alt="logo"
            className={utilFmt.classes(
              'max-w-logo cursor-pointer mt-3 mx-10',
              'max-sm:mt-4 max-sm:max-w-logo-m max-sm:ml-2'
            )}
            onClick={() => router.push(Routes.index)}
          />
          {isDesktop && <DesktopHeader items={[]} />}
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
          <Button
            variant="contained"
            color="primary"
            classes={{ root: '!mx-10 max-sm:!mx-4' }}
            onClick={() => {}}
          >
            {t('login.tosignin')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Header
