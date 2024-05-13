import React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

export const TradingViewLink = () => {
  const { t } = useTranslation()

  return (
    <span className="text-zinc-500 text-sm">
      {t('tv.chart.intro').split('$')[0]}
      <Link
        href="https://www.tradingview.com/"
        target="_blank"
        className="ml-1 text-blue-600 hover:underline"
      >
        TradingView
      </Link>
      {t('tv.chart.intro').split('$')[1]}
      <Link
        href="https://www.tradingview.com/symbols/BTCUSDT/"
        target="_blank"
        className="mx-1 text-blue-600 hover:underline"
      >
        BTC/USDT
      </Link>
      {t('tv.chart.intro').split('$')[2]}
    </span>
  )
}

export default TradingViewLink
