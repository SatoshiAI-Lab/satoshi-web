import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import clsx from 'clsx'

import { KLINE_RESOLUTIONS } from '@/config/kline'
import { useKLineStore } from '@/stores/use-kline-store'
import { useStorage } from '@/hooks/use-storage'
import { TV_INTERVAL_MAP } from '@/config/tradingview'

import type { ResolutionString } from '../../../../public/tradingview/charting_library/charting_library'

interface IntervalProps extends React.ComponentProps<'div'> {
  showFullscreen?: boolean
}

export const Intervals = (props: IntervalProps) => {
  const { showFullscreen = true, className = '' } = props
  const { chart, interval, getResetCacheMap, setInterval } = useKLineStore()
  const { setKLineInterval } = useStorage()

  const onIntervalClick = (item: (typeof KLINE_RESOLUTIONS)[number]) => {
    const { interval: newInterval, name } = item
    if (newInterval === interval) return

    console.log(
      'switch interval',
      interval,
      getResetCacheMap().keys(),
      TV_INTERVAL_MAP[interval],
      newInterval
    )

    const tvChart = chart?.activeChart()
    const targetResetId = Array.from(getResetCacheMap().keys()).find((id) =>
      id.endsWith(TV_INTERVAL_MAP[interval].toUpperCase())
    )

    const resetChartCache = getResetCacheMap().get(targetResetId ?? '')
    if (resetChartCache) {
      resetChartCache()
      tvChart?.resetData()
      tvChart?.setResolution(newInterval as ResolutionString)
      setInterval(name)
      setKLineInterval(name)
      return
    }

    toast.error(`[Switch Error]: Not have reset cache.`)
  }

  useEffect(() => {
    console.log('init interval', interval)
  }, [])

  return (
    <div className={clsx('flex justify-between px-1', className)}>
      <div className="flex items-center gap-4 px-1">
        {KLINE_RESOLUTIONS.map((item, i) => (
          <div
            key={i}
            className={clsx(
              'cursor-pointer transition-all hover:text-gray-600',
              interval === item.name ? 'text-black' : 'text-gray-400'
            )}
            onClick={() => onIntervalClick(item)}
          >
            {item.name}
          </div>
        ))}
      </div>
      {showFullscreen && (
        <div
          className={clsx(
            'cursor-pointer transition-all',
            'text-gray-400 hover:text-gray-800'
          )}
          onClick={() => chart?.startFullscreen()}
        >
          Fullscreen
        </div>
      )}
    </div>
  )
}

export default Intervals
