import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { Button } from '@mui/material'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import type { AnyObject } from '@/types/types'
import type {
  CexTag,
  ChartTokenParams,
  DexTag,
  TagString,
} from './hooks/use-kline-api/types'

import Intervals from './components/intervals'
import Studies from './components/studies'
import { TV_CHART_OVERRIDES } from '@/config/tradingview'
import { useStudiesAnalysis } from './hooks/use-study-analysis'
import { useKLineCreate } from '@/views/kline/hooks/use-kline'
import { useTagParser } from './hooks/use-tag-parser'

import { TradingViewLink } from '@/components/trading-view-link'

export const Candlestick = () => {
  const router = useRouter()
  const chartRef = useRef<HTMLDivElement>(null)
  const { createChart, clearChart } = useKLineCreate()
  const { redBlackSoldiers, detectPinBars, detectSpiralCandles } =
    useStudiesAnalysis()
  const { t } = useTranslation()
  const { cexTagToCexParams, dexTagToDexParams } = useTagParser()

  const parseTagQuery = (tag?: TagString) => {
    if (!tag) return
    if (tag.startsWith('cex')) {
      return cexTagToCexParams(tag as CexTag)
    }
    if (tag.startsWith('dex')) {
      return dexTagToDexParams(tag as DexTag)
    }
  }

  // TODO: Waiting for implement
  const parseQuery = (options: AnyObject<string>) => {
    return {} as ChartTokenParams
  }

  // Create and initial chart style.
  const createCandleChart = async () => {
    const { tag: tagString, ...restOptions } = router.query
    const tag = parseTagQuery(tagString as TagString | undefined)
    const options = parseQuery(restOptions as AnyObject<string>)

    if (!tag) {
      toast.error(`[Create Chart Error]: Invalid tag: ${tag}`)
      return
    }

    // If have tag, use tag, or else use options.
    const chartIns = await createChart(chartRef.current!, tag).catch(
      (e) => (toast.error(`Create Chart Error: ${e}`), null)
    )

    chartIns?.applyOverrides(TV_CHART_OVERRIDES)
  }

  // Create chart on mounted.
  useEffect(() => {
    // Handle refresh browser, in first render, browser can't get `router.query`,
    // bacause it hasn't been hydration yet, on `router.isReady`, it's ok.
    if (!router.isReady) return
    if (!chartRef.current) return

    createCandleChart()
    return clearChart
  }, [router.isReady])

  return (
    <div className="h-screen flex flex-col p-3">
      <div className="flex items-center mb-2">
        <Button variant="contained" size="small" onClick={router.back}>
          {t('back')}
        </Button>
        <Intervals className="ml-3" showFullscreen={false} />
      </div>
      <div
        ref={chartRef}
        className={clsx(
          'h-full border border-solid border-gray-300',
          'rounded overflow-hidden'
        )}
      ></div>
      <div className="flex items-center justify-between">
        <Studies />
        <TradingViewLink />
      </div>
    </div>
  )
}

export default Candlestick
