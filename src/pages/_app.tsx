import { useEffect, useState } from 'react'
import Head from 'next/head'
import { ThemeProvider, createTheme } from '@mui/material'
import { I18nextProvider, useTranslation } from 'react-i18next'
import { Toaster } from 'react-hot-toast'

import '@/theme/global.scss'
import i18nConfig from '@/i18n'
import { themeOptions } from '@/theme/material-ui'
import { useStorage } from '@/hooks/use-storage'

import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  const { t, i18n } = useTranslation()
  const [isMounted, setIsMounted] = useState(false)
  // TODO: implement theming detection hook
  const isDark = true
  const materialTheme = createTheme(themeOptions(isDark))
  const { getLang } = useStorage()

  // Initial language selected, if has cached.
  const initialLang = () => {
    const lang = getLang()

    if (lang?.trim()) {
      i18n.changeLanguage(lang)
    }
  }

  useEffect(() => {
    setIsMounted(true)
    initialLang()
  }, [])

  // Prevent inconsistent rendering.
  if (!isMounted) return

  return (
    <ThemeProvider theme={materialTheme}>
      <I18nextProvider i18n={i18nConfig}>
        <Head>
          <title>{t('satoshiai')}</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
          ></meta>
        </Head>
        <Component {...pageProps} />
        <Toaster />
      </I18nextProvider>
    </ThemeProvider>
  )
}
