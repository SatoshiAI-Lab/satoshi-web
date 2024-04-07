import { TV_DATAFEED_CONFIG, TV_SYMBOL_INFO_CONFIG } from '@/config/tradingview'
import { KLINE_SUPPORTED_INTERVALS } from '@/config/kline'
import { useKLineFormat } from '@/views/kline/hooks/use-kline-format'
import { useKLineStore } from '@/stores/use-kline-store'
import { utilKLine } from '@/utils/kline'
import { useDatafeedCache } from '../use-datafeed-cache'
import { useDatafeedHelper } from '../use-datafeed-helper'

import type {
  IBasicDataFeed,
  ResolutionString,
  LibrarySymbolInfo,
  Mark,
} from '../../../../../public/tradingview/charting_library/charting_library'
import type { Datafeeder, UseDatafeed } from './types'

export const useDatafeed: UseDatafeed = () => {
  const datafeedCacheApi = useDatafeedCache()
  const { formatReceivedBars, priceToPricescale } = useKLineFormat()
  const { getInitBars, handleInitBars, getHistoryBars, onUpdateBar } =
    useDatafeedHelper(datafeedCacheApi)

  const datafeeder: Datafeeder = () => {
    // datafeed callback must be called in async function,
    // otherwise will be stack overflow.
    return {
      onReady(callback) {
        setTimeout(() => callback(TV_DATAFEED_CONFIG), 0)
      },
      searchSymbols(userInput, exchange, symbolType, onResultReadyCallback) {},
      async resolveSymbol(symbolName, onSymbolResolved, onResolveError) {
        try {
          const tradingPair = `${symbolName}-USDT`
          // Initial `symbolInfo`, you can modify it in `getBars`
          const symbolInfo: LibrarySymbolInfo = {
            ...TV_SYMBOL_INFO_CONFIG,
            name: symbolName,
            full_name: tradingPair.toUpperCase(),
            description: tradingPair.toUpperCase(),
          }
          const { interval } = useKLineStore.getState()
          const { bars, lastBar } = await getInitBars(
            symbolInfo,
            interval as ResolutionString
          )
          const newPricescale = priceToPricescale(lastBar.open)

          symbolInfo.pricescale = newPricescale
          datafeedCacheApi.setInitBars(bars)
          datafeedCacheApi.setLastBar(lastBar)
          setTimeout(() => onSymbolResolved(symbolInfo), 0)
        } catch (error) {
          onResolveError(`Cannot resolve this smybol: ${symbolName}`)
        }
      },
      // If the data is correct, but the chart is blank,
      // check the timestamp is normal, and the order is correct.
      // The order should be ascending.
      async getBars(symbolInfo, resolution, periodParams, onHistory, onError) {
        // First request, switch resolution is also first request.
        if (periodParams.firstDataRequest) {
          const bars = await handleInitBars(symbolInfo, resolution)

          datafeedCacheApi.setLastResolution(resolution)
          onHistory(bars, { noData: !bars.length })
          return
        }

        const bars = await getHistoryBars(symbolInfo, periodParams)

        onHistory(bars, { noData: !bars.length })
      },
      subscribeBars(
        symbolInfo,
        resolution,
        onTick,
        subscribeUID,
        onResetCacheNeededCallback
      ) {
        datafeedCacheApi.resetCacheMap.set(
          subscribeUID,
          onResetCacheNeededCallback
        )

        onUpdateBar((received) => {
          const bars = formatReceivedBars(received.data ?? [])
          if (!bars.length) return
          const targetResolution = useKLineStore.getState()
            .interval as KLINE_SUPPORTED_INTERVALS

          if (utilKLine.isTargetPeriod(targetResolution)) {
            bars.forEach((bar) => {
              const lastTime = datafeedCacheApi.getLastBar().time ?? Infinity

              if (bar.time < lastTime) return
              onTick(bar)
            })
          }

          const last = bars[bars.length - 1]
          if (!last) return
          onTick(last)
          return

          bars.forEach((bar) => {
            const lastBarTime = datafeedCacheApi.getLastBar().time

            if (bar.time < lastBarTime) return
            setTimeout(() => onTick(bar))
          })
        })
      },
      unsubscribeBars(subscriberUID) {
        datafeedCacheApi.resetCacheMap.delete(subscriberUID)
      },

      getMarks(symbolInfo, from, to, onDataCallback, resolution) {
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
      getTimescaleMarks(symbolInfo, from, to, onDataCallback, resolution) {
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
    getResetCacheMap: () => datafeedCacheApi.resetCacheMap,
  }
}
