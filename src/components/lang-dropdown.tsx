import React from 'react'
import { useTranslation } from 'react-i18next'
import { IoLanguageOutline } from 'react-icons/io5'

import type { CustomDropdownItem } from './custom-dropdown/types'

import { CustomDropdown } from './custom-dropdown'
import { useStorage } from '@/hooks/use-storage'
import { resources } from '@/i18n'

interface Props extends React.ComponentProps<'div'> {}

const langs = Object.entries(resources).map(([key, val]) => ({
  key: key,
  label: val.name as string,
}))

export const LangDropdown = (props: Props) => {
  const {} = props
  const { i18n } = useTranslation()
  const { getLang, setLang } = useStorage()

  const onLangChange = (item: CustomDropdownItem) => {
    const lang = String(item.key)

    if (i18n.language === lang) return

    i18n.changeLanguage(lang)
    setLang(lang)
  }

  return (
    <CustomDropdown
      items={langs}
      active={getLang() || 'en'}
      onItemClick={onLangChange}
    >
      <IoLanguageOutline size={22} className="text-black dark:text-white" />
    </CustomDropdown>
  )
}

export default LangDropdown
