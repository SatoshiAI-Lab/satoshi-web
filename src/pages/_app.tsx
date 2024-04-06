import { useEffect, useState } from 'react'
import Head from 'next/head'
import { ThemeProvider, createTheme } from '@mui/material'
import { I18nextProvider, useTranslation } from 'react-i18next'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import '@/theme/global.scss'
import i18nConfig from '@/i18n'
import { themeOptions } from '@/theme/material-ui'
import { useStorage } from '@/hooks/use-storage'
import { useThemeStore } from '@/stores/use-theme-store'

import type { AppProps } from 'next/app'
import { useTokenRefresh } from '@/hooks/use-token-refresh'

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  const [isMounted, setIsMounted] = useState(false)
  const { isDark } = useThemeStore()
  const materialTheme = createTheme(themeOptions(isDark))
  const { getLang } = useStorage()
  const { t, i18n } = useTranslation()
  const { watch } = useTokenRefresh()

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
    watch()
  }, [])

  // Prevent inconsistent rendering.
  if (!isMounted) return

  return (
    <ThemeProvider theme={materialTheme}>
      <I18nextProvider i18n={i18nConfig}>
        <QueryClientProvider client={queryClient}>
          <Head>
            <title>{t('satoshi')}</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
            ></meta>
          </Head>
          <Component {...pageProps} />
          <Toaster />
        </QueryClientProvider>
      </I18nextProvider>
    </ThemeProvider>
  )
}
