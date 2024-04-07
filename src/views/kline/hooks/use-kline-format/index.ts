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

/**
 * TradingView chart data format hook
 */
export const useKLineFormat: UseKLineFormat = () => {
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
      time: Math.floor(bar._ts * 1000),
    }))

    return formatBars
  }

  const priceToPricescale: PriceToPricescale = (p) => {
    const decimal = p.toString().split('.')[1]
    const len = decimal?.length ?? 0

    if (len <= 2) return 100

    return Number('1'.padEnd(len + 1, '0'))
  }

  return {
    formatExportedData,
    formatReceivedBars,
    arrayToSeries,
    fixMinute,
    priceToPricescale,
  }
}
