import React from 'react'
import clsx from 'clsx'

import { useChartStore } from '@/stores/use-chart-store'
import { useKLineFormat } from '../hooks/use-kline-format'
import { useRouter } from 'next/router'
import { utilArr } from '@/utils/array'
import { TV_DATAFEED_CONFIG } from '@/config/tradingview'
import { useTagParser } from '../hooks/use-tag-parser'

import type { ResolutionString } from '../../../../public/tradingview/charting_library/charting_library'
import type { TagString } from '../hooks/use-kline-api/types'

interface IntervalProps extends React.ComponentProps<'div'> {
  showFullscreen?: boolean
}

export const Intervals = (props: IntervalProps) => {
  const { showFullscreen = true, className = '' } = props
  const { chart, setInterval } = useChartStore()
  const { toNormalInterval } = useKLineFormat()
  const { tagToParams } = useTagParser()
  const router = useRouter()
  const interval = tagToParams(router.query.tag as TagString).interval

  // Not needed at the moment.
  // if switch interval ouccured time violation error,
  // you may need this function.
  // const clearCache = () => {
  //   const targetResetId = Array.from(getResetCacheMap().keys()).find((id) =>
  //     // Note: Here `interval` is old interval,
  //     // don't use new interval(`resolution` or `newInterval`)
  //     id.endsWith(toTVInterval(interval).toUpperCase())
  //   )
  //   const resetChartCache = getResetCacheMap().get(targetResetId ?? '')

  //   if (!resetChartCache) {
  //     toast.error(`[Switch Error]: Not have reset cache.`)
  //     return false
  //   }

  //   resetChartCache()
  //   return true
  // }

  const modifyQueryInterval = (newInterval: string) => {
    const tag = router.query.tag as TagString
    const modified = utilArr.modifyLast(
      tag.split(':'),
      toNormalInterval(newInterval)
    )
    const newTag = modified.join(':')

    router.push({
      pathname: router.pathname,
      query: { tag: newTag },
    })
  }

  const onIntervalClick = (resolution: ResolutionString) => {
    const activeChart = chart?.activeChart()
    const newInterval = toNormalInterval(resolution)

    // If need clear cache, uncomment here.
    // if (!clearCache()) return
    modifyQueryInterval(newInterval)
    setInterval(newInterval)
    activeChart?.resetData()
    activeChart?.setResolution(resolution)
  }

  return (
    <div className={clsx('flex justify-between px-1', className)}>
      <div className="flex items-center gap-4 px-1">
        {TV_DATAFEED_CONFIG.supported_resolutions?.map((r, i) => (
          <div
            key={i}
            className={clsx(
              'cursor-pointer transition-all hover:text-gray-600',
              toNormalInterval(r) === interval ? 'text-black' : 'text-gray-400'
            )}
            onClick={() => onIntervalClick(r)}
          >
            {toNormalInterval(r)}
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
