import { useEffect, useState } from 'react'
import Head from 'next/head'
import { ThemeProvider, createTheme } from '@mui/material'
import { I18nextProvider } from 'react-i18next'

import '@/theme/global.scss'
import i18nConfig from '@/i18n'
import { themeOptions } from '@/theme/material-ui'

import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  const [isMounted, setIsMounted] = useState(false)
  // TODO: implement theming detection hook
  const isDark = true
  const materialTheme = createTheme(themeOptions(isDark))

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Prevent inconsistent rendering.
  if (!isMounted) return

  return (
    <ThemeProvider theme={materialTheme}>
      <I18nextProvider i18n={i18nConfig}>
        <Head>
          <title>Satoshi</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
          ></meta>
        </Head>
        <Component {...pageProps} />
      </I18nextProvider>
    </ThemeProvider>
  )
}
