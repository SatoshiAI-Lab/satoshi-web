import React from 'react'
import toast from 'react-hot-toast'
import clsx from 'clsx'

import { KLINE_RESOLUTIONS } from '@/config/kline'
import { useKLineStore } from '@/stores/use-kline-store'
import { useStorage } from '@/hooks/use-storage'

import type { ResolutionString } from '../../../../public/tradingview/charting_library/charting_library'

interface IntervalProps extends React.ComponentProps<'div'> {
  showFullscreen?: boolean
}

export const Intervals = (props: IntervalProps) => {
  const { showFullscreen = true, className = '' } = props
  const { chart, interval, getResetCacheMap, setInterval } = useKLineStore()
  const { setKLineInterval } = useStorage()

  const onIntervalClick = (item: (typeof KLINE_RESOLUTIONS)[number]) => {
    console.log('get resetcachemap', getResetCacheMap())
    const { interval: newInterval } = item
    const tvChart = chart?.activeChart()
    const targetResetId = Array.from(getResetCacheMap().keys()).find((id) =>
      id.endsWith(interval)
    )
    const resetChartCache = getResetCacheMap().get(targetResetId ?? '')

    if (newInterval === interval) return
    if (resetChartCache) {
      resetChartCache()
      tvChart?.resetData()
      tvChart?.setResolution(newInterval as ResolutionString)
      setInterval(newInterval)
      setKLineInterval(newInterval)
      return
    }

    toast.error('Switch Eror')
  }

  return (
    <div className={clsx('flex justify-between px-1', className)}>
      <div className="flex items-center gap-4 px-1">
        {KLINE_RESOLUTIONS.map((item, i) => (
          <div
            key={i}
            className={clsx(
              'cursor-pointer transition-all hover:text-gray-600',
              interval === item.interval ? 'text-black' : 'text-gray-400'
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
