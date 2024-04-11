import toast from 'react-hot-toast'

import { TV_DATAFEED_CONFIG, TV_SYMBOL_INFO_CONFIG } from '@/config/tradingview'
import { useKLineFormat } from '@/views/kline/hooks/use-kline-format'
import { useChartStore } from '@/stores/use-chart-store'
import { utilChart } from '@/utils/kline'
import { useDatafeedCache } from '../use-datafeed-cache'
import { useDatafeedHelper } from '../use-datafeed-helper'
import { utilArr } from '@/utils/array'

import type {
  IBasicDataFeed,
  LibrarySymbolInfo,
  Mark,
} from '../../../../../public/tradingview/charting_library/charting_library'
import type { CexParams, DexParams } from '../use-kline-api/types'

export const useDatafeed = () => {
  const datafeedCacheApi = useDatafeedCache()
  const { formatReceivedBars, priceToPricescale } = useKLineFormat()
  const {
    getInitBars,
    handleInitBars,
    getHistoryBars,
    onUpdateBar,
    onErrorMessage,
    disconnect,
  } = useDatafeedHelper(datafeedCacheApi)

  const datafeeder = (params: CexParams | DexParams) => {
    // datafeed callback must be called in async function,
    // otherwise will be stack overflow.
    return {
      // Main config function, chart init config.
      onReady(ready) {
        // WebSocket error message.
        onErrorMessage((e) => toast.error(e.message ?? ''))
        setTimeout(() => ready(TV_DATAFEED_CONFIG), 0)
      },
      // TV's search function.
      searchSymbols(input, exchange, symbolType, onResultReady) {},
      // Main symbol function, symbol init info config.
      async resolveSymbol(symbolName, onResolve, onError) {
        // Initial `symbolInfo`, you can modify it in `getBars`
        const symbolInfo: LibrarySymbolInfo = {
          ...TV_SYMBOL_INFO_CONFIG,
          name: symbolName,
          full_name: symbolName.toUpperCase(),
          description: symbolName.toUpperCase(),
        }

        try {
          const { bars, lastBar } = await getInitBars(symbolInfo, params)
          const newPricescale = priceToPricescale(lastBar.open)

          symbolInfo.pricescale = newPricescale
          datafeedCacheApi.setInitBars(bars)
          datafeedCacheApi.setLastBar(lastBar)
          setTimeout(() => onResolve(symbolInfo), 0)
        } catch (error) {
          console.log('error', error)
          onError(`Cannot resolve this smybol: ${symbolName}`)
        }
      },
      // Main data getting function, init & switch interval will be call.
      async getBars(symbolInfo, resolution, periodParams, onHistory) {
        // First request, switch resolution is also first request.
        if (periodParams.firstDataRequest) {
          const bars = await handleInitBars(symbolInfo, params, resolution)

          datafeedCacheApi.setLastResolution(resolution)
          onHistory(bars, { noData: utilArr.isEmpty(bars) })
          return
        }

        const bars = await getHistoryBars(periodParams)
        onHistory(bars, { noData: utilArr.isEmpty(bars) })
      },
      // Real-time update bar & reset last one subscribe cache.
      subscribeBars(_, resolution, onTick, uId, cacheRestter) {
        datafeedCacheApi.setSubscribe(uId, cacheRestter)
        console.log(
          `subscribe cache:`,
          datafeedCacheApi.getSubscribes(),
          '\n',
          `sub resolution: ${resolution}`,
          '\n',
          `stored interval: ${useChartStore.getState().interval}`
        )

        onUpdateBar((received) => {
          const bars = formatReceivedBars(received.data ?? [])

          if (!bars.length) return
          if (utilChart.isTargetPeriod(resolution)) {
            bars.forEach((bar) => {
              const lastTime = datafeedCacheApi.getLastBar().time ?? Infinity

              if (bar.time < lastTime) return
              onTick(bar)
            })
          }

          onTick(utilArr.last(bars))
        })
      },
      // Don't disconnect here. because switch interval will be call.
      unsubscribeBars(uId) {
        console.log('unsubscribe cache:', uId, datafeedCacheApi.getSubscribes())

        // clear cache.
        datafeedCacheApi.getSubscribe(uId)?.()
        datafeedCacheApi.removeSubscribe(uId)
      },

      // Below is not needed at the moment.
      getMarks(symbolInfo, from, to, onData, resolution) {
        // console.log('getMarks', symbolInfo, from, to, resolution)

        const marks = [
          {
            id: 1,
            time: to,
            color: 'red',
            text: 'This is the mark pop-up text.',
            label: 'M',
            labelFontColor: 'blue',
            minSize: 25,
          },
          {
            id: 2,
            time: to,
            color: 'red',
            text: 'Second marker',
            label: 'S',
            labelFontColor: 'green',
            minSize: 25,
          },
        ] as Mark[]

        // onDataCallback(marks)
      },
      getTimescaleMarks(symbolInfo, from, to, onData, resolution) {
        // console.log('getTimescaleMarks', symbolInfo, from, to, resolution)

        const marks = [
          {
            id: 'String id',
            time: from,
            color: 'red',
            label: 'T',
            tooltip: ['Nulla'],
          },
        ]

        // onDataCallback(marks)
      },
    } as IBasicDataFeed
  }

  return {
    datafeeder,
    disconnect,
  }
}
