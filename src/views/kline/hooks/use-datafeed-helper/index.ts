import {
  TV_DEFAULT_QUOTE,
  TV_DEFAULT_SOURCE_PAIR,
  TV_RESOLUTION_MAP,
} from '@/config/tradingview'
import { useKLineApi } from '../use-kline-api'
import { useKLineFormat } from '../use-kline-format'
import { useDatafeedCache } from '../use-datafeed-cache'
import { utilArr } from '@/utils/array'
import { utilParse } from '@/utils/parse'

import type {
  LibrarySymbolInfo,
  ResolutionString,
  PeriodParams,
} from '../../../../../public/tradingview/charting_library/charting_library'
import type { SymbolStr } from '../use-kline-api/types'

/**
 * Datafeed APIs helper, handle KLine API for datafeed.
 */
export const useDatafeedHelper = (
  cachedApi: ReturnType<typeof useDatafeedCache>
) => {
  const {
    getTokenSources,
    listenToken,
    getHistory,
    onUpdateBar,
    onErrorMessage,
  } = useKLineApi()
  const { formatReceivedBars } = useKLineFormat()

  // Parsing query source.
  const getQuerySource = () => {
    const { source } = utilParse.qs2Obj(location.search)

    if (!source) return
    return [source, TV_DEFAULT_QUOTE]
  }

  const getSourceQuote = async (token: string, useCachedSource?: boolean) => {
    const queryPair = getQuerySource()

    // If query source is exist, prioritize usage.
    if (queryPair) return queryPair
    if (useCachedSource) {
      return cachedApi.getLastSourcePair() ?? TV_DEFAULT_SOURCE_PAIR
    }

    const received = await getTokenSources(token)
    const sourcePair = utilArr.first(received?.data ?? [TV_DEFAULT_SOURCE_PAIR])

    cachedApi.setLastSourcePair(sourcePair)
    return sourcePair
  }

  const getInitBars = async (
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    useCachedSource?: boolean
  ) => {
    const { name: token } = symbolInfo
    const [source, quote] = await getSourceQuote(token, useCachedSource)
    // console.log('fk', 'source, quote')
    const symbol = `${token}-${quote}`.toUpperCase() as SymbolStr
    const tvInterval =
      resolution.toLowerCase() as keyof typeof TV_RESOLUTION_MAP
    // Convert a interval to TradingView format interval.
    const interval = TV_RESOLUTION_MAP[tvInterval] ?? tvInterval

    const received = await listenToken({
      source,
      symbol,
      interval,
    })
    const bars = formatReceivedBars(received.data ?? [])
    const lastBar = utilArr.last(bars)

    cachedApi.setLastBar(lastBar)
    Object.assign(symbolInfo, {
      exchange: source.toUpperCase(),
      listed_exchange: source,
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
        const { bars } = await getInitBars(symbolInfo, resolution, true)

        return bars
      }

      const cachedBars = cachedApi.getInitBars()
      const { bars } = utilArr.isNotEmpty(cachedBars)
        ? { bars: cachedBars }
        : await getInitBars(symbolInfo, resolution)

      return bars
    } catch (error) {
      const e = error as { msg?: string }
      console.error(`${e?.msg}`)

      return []
    }
  }

  // Get token history bars.
  const getHistoryBars = async (
    symbolInfo: LibrarySymbolInfo,
    periodParams: PeriodParams
  ) => {
    const { full_name } = symbolInfo
    const { from, to, countBack } = periodParams
    const received = await getHistory({
      symbol: full_name as SymbolStr,
      start: from,
      end: to,
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
