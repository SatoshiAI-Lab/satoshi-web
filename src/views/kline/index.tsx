import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { Button } from '@mui/material'
import clsx from 'clsx'
import toast from 'react-hot-toast'

import Intervals from './components/intervals'
import Studies from './components/studies'
import { useStorage } from '@/hooks/use-storage'
import { useKLineStore } from '@/stores/use-kline-store'
import { TV_CHART_OVERRIDES } from '@/config/tradingview'
import { useStudiesAnalysis } from './hooks/use-study-analysis'
import { useKLine } from '@/views/kline/hooks/use-kline'

import type { AnyObject } from '@/types/types'

const KLine = () => {
  const router = useRouter()
  const { getKLineInterval } = useStorage()
  const chartRef = useRef<HTMLDivElement>(null)
  const { chart } = useKLineStore()
  const { createChart } = useKLine()
  const { redBlackSoldiers, detectPinBars, detectSpiralCandles } =
    useStudiesAnalysis()

  // Create and initial chart style.
  const createKLineChart = async () => {
    const { symbol, interval } = router.query as AnyObject<string | undefined>
    const chartIns = await createChart(chartRef.current!, {
      symbol: symbol ?? 'BTC-USDT',
      interval: interval ?? getKLineInterval() ?? '1d',
    }).catch((e) => (toast.error(`Create Chart Error: ${e}`), null))

    chartIns?.applyOverrides(TV_CHART_OVERRIDES)
  }

  // Create chart on mounted.
  useEffect(() => {
    // Handle refresh browser, in first render, browser can't get `router.query`,
    // bacause it hasn't been hydration yet, on `router.isReady`, it's ok.
    if (!router.isReady) return

    createKLineChart()
    return () => chart?.remove()
  }, [router.isReady])

  return (
    <div className="h-screen flex flex-col p-3">
      <div className="flex items-center mb-2">
        <Button variant="contained" size="small" onClick={router.back}>
          Back
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
      <Studies />
    </div>
  )
}

export default KLine
