import type { AnyObject } from '@/types/types'
import type {
  UseKLineFormat as UseKLineFormat,
  FormatExportedDataItem,
  FormatExportedData,
  ArrayToSeries,
  FixMinute,
  FormatReceivedBars,
  PriceToPricescale,
} from './types'
import { ResolutionString } from '../../../../../public/tradingview/charting_library/charting_library'

export const useKLineFormat = () => {
  const formatExportedData: FormatExportedData = (rawData, handler) => {
    return rawData.data.map((items, i) => {
      const result: AnyObject = {
        raw: Array.from(items),
        formated: [],
      }
      const formated = Array.from(items).map((item, i) => {
        const descField = rawData.schema[i]

        if (descField.type === 'time') {
          result.time = item
        } else if (descField.type === 'userTime') {
          result.userTime = item
        } else {
          Object.assign(result, { [descField.plotTitle]: item })
        }

        return { ...descField, value: item }
      })

      result.formated = formated
      handler?.(result as FormatExportedDataItem, i, rawData)

      return formated
    })
  }

  const arrayToSeries: ArrayToSeries = (arr, isMillisecond = false) => {
    return Array.from(arr).map((item) => {
      const [time, open, high, low, close, volume] = Array.from(item)

      return {
        time: isMillisecond ? time : time * 1000,
        open,
        high,
        low,
        close,
        volume,
      }
    })
  }

  const fixMinute: FixMinute = (s) => {
    const reg = /^\d+$/
    const result = reg.test(s) ? `${s}m` : s

    return result
  }

  const formatReceivedBars: FormatReceivedBars = (bars) => {
    if (!bars || !bars.length) return []

    const formatBars = bars.map((bar) => ({
      ...bar,
      time: Math.floor(bar.timestamp * 1000),
    }))

    return formatBars
  }

  const priceToPricescale: PriceToPricescale = (p) => {
    const decimal = p.toString().split('.')[1]
    const len = decimal?.length ?? 0

    if (len <= 2) return 100

    return Number('1'.padEnd(len + 1, '0'))
  }

  const toTVInterval = (interval?: string) => {
    if (!interval || !interval.trim()) return '1'
    // TradingView's `minutes` do not have `m`
    if (interval.endsWith('m')) return interval.replace('m', '')
    if (interval === '1h') return '60'
    if (interval === '4h') return '240'

    return interval
  }

  const toNormalInterval = (tvInterval?: string) => {
    if (!tvInterval || !tvInterval.trim()) return '1m'
    const num = Number(tvInterval)
    if (num < 60) return `${tvInterval}m`
    if (num === 60) return '1h'
    if (num === 240) return '4h'

    return tvInterval.toLowerCase()
  }

  return {
    formatExportedData,
    formatReceivedBars,
    arrayToSeries,
    fixMinute,
    priceToPricescale,
    toTVInterval,
    toNormalInterval,
  }
}
