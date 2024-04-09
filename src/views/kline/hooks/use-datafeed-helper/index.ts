import { TV_DEFAULT_QUOTE, TV_RESOLUTION_MAP } from '@/config/tradingview'
import { useKLineApi } from '../use-kline-api'
import { useKLineFormat } from '../use-kline-format'
import { useDatafeedCache } from '../use-datafeed-cache'
import { utilArr } from '@/utils/array'
import { useKLineApiFormat } from '../use-kline-api-format'

import type {
  LibrarySymbolInfo,
  ResolutionString,
  PeriodParams,
} from '../../../../../public/tradingview/charting_library/charting_library'
import type { CexTag, SymbolStr } from '../use-kline-api/types'

/**
 * Datafeed APIs helper, handle KLine API for datafeed.
 */
export const useDatafeedHelper = (
  cachedApi: ReturnType<typeof useDatafeedCache>
) => {
  const { listenToken, getHistory, onUpdateBar, onErrorMessage } = useKLineApi()
  const { formatReceivedBars } = useKLineFormat()
  const { toCexTag, toDexTag, parseCexTag, parseDexTag } = useKLineApiFormat()

  const getInitBars = async (
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString
  ) => {
    const { name: token } = symbolInfo
    const symbol = `${token}-${TV_DEFAULT_QUOTE}`.toUpperCase() as SymbolStr
    const tvInterval =
      resolution.toLowerCase() as keyof typeof TV_RESOLUTION_MAP
    // Convert a interval to TradingView format interval.
    const interval = TV_RESOLUTION_MAP[tvInterval] ?? tvInterval

    const received = await listenToken({
      // TODO: judgement Cex or Dex
      tag: toCexTag({
        exchange: '*',
        symbol,
        interval,
      }),
    })
    const bars = formatReceivedBars(received.data ?? [])
    const lastBar = utilArr.last(bars)
    // TODO: judgement Cex or Dex
    const { exchange } = parseCexTag(received.tag as CexTag)

    cachedApi.setLastBar(lastBar)
    cachedApi.setLastTag(received.tag!)
    Object.assign(symbolInfo, {
      exchange: exchange.toUpperCase(),
      listed_exchange: exchange,
    } as typeof symbolInfo)

    return { bars, lastBar }
  }

  /**
   * Handling Init bars, switching resolution is also init.
   * @param {LibrarySymbolInfo} symbolInfo
   * @param {ResolutionString} resolution
   */
  const handleInitBars = async (
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString
  ) => {
    try {
      // If `lastResolution` is exist, it means that the user is switching time granularity.
      const hasLastResolution = cachedApi.getLastResolution()

      // If the `resolution` is the same as the last time,
      // it means repeat, should be return.
      if (hasLastResolution && hasLastResolution === resolution) return []

      // Switching `resolution` should be unlisten and listen again.
      // but, useKLineApi has already been handled unlisten.
      if (hasLastResolution) {
        const { bars } = await getInitBars(symbolInfo, resolution)

        return bars
      }

      const cachedBars = cachedApi.getInitBars()
      const { bars } = utilArr.isNotEmpty(cachedBars)
        ? { bars: cachedBars }
        : await getInitBars(symbolInfo, resolution)

      return bars
    } catch (error) {
      const e = error as { msg?: string }
      console.error(`[handleInitBars Error]: ${e?.msg}`)

      return []
    }
  }

  // Get token history bars.
  const getHistoryBars = async (periodParams: PeriodParams) => {
    const { from, to, countBack } = periodParams
    const received = await getHistory({
      tag: cachedApi.getLastTag(),
      start: from,
      limit: countBack,
    })
    const bars = formatReceivedBars(received.data ?? [], countBack)

    return bars
  }

  return {
    getInitBars,
    handleInitBars,
    getHistoryBars,
    onUpdateBar,
    onErrorMessage,
  }
}
