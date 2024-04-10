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
import type {
  CexParams,
  CexTag,
  DexParams,
  DexTag,
} from '../use-kline-api/types'

/**
 * Datafeed APIs helper, handle KLine API for datafeed.
 */
export const useDatafeedHelper = (
  cachedApi: ReturnType<typeof useDatafeedCache>
) => {
  const { listenToken, getHistory, onUpdateBar, onErrorMessage, disconnect } =
    useKLineApi()
  const { formatReceivedBars, toNormalInterval } = useKLineFormat()
  const {
    cexParamsToCexTag,
    cexTagToCexParams,
    dexParamsToDexTag,
    dexTagToDexParams,
    joinParams,
    tagIsCex,
  } = useKLineApiFormat()

  const getInitBars = async (
    symbolInfo: LibrarySymbolInfo,
    params: CexParams | DexParams
  ) => {
    const tag =
      params.type === 'cex'
        ? cexParamsToCexTag(params)
        : dexParamsToDexTag(params)
    const received = await listenToken({ tag })
    const bars = formatReceivedBars(received.data ?? [])
    const lastBar = utilArr.last(bars)
    const parsedParams = joinParams(
      tagIsCex(received?.tag)
        ? cexTagToCexParams(received?.tag as CexTag)
        : dexTagToDexParams(received?.tag as DexTag)
    )

    cachedApi.setLastBar(lastBar)
    cachedApi.setLastTag(received.tag!)
    Object.assign(symbolInfo, {
      exchange: parsedParams.source.toUpperCase(),
      listed_exchange: parsedParams.source,
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
    params: CexParams | DexParams,
    resolution: ResolutionString
  ) => {
    console.log('resolution', resolution)
    try {
      // If `lastResolution` is exist, it means that the user is switching time granularity.
      const hasLastResolution = cachedApi.getLastResolution()

      // If the `resolution` is the same as the last time,
      // it means repeat, should be return.
      if (hasLastResolution && hasLastResolution === resolution) return []

      // Switching `resolution` should be unlisten and listen again.
      // but, useKLineApi has already been handled unlisten.
      if (hasLastResolution) {
        // This is switch interval
        const { bars } = await getInitBars(symbolInfo, {
          ...params,
          interval: toNormalInterval(resolution),
        })

        return bars
      }

      const cachedBars = cachedApi.getInitBars()
      const { bars } = utilArr.isNotEmpty(cachedBars)
        ? { bars: cachedBars }
        : await getInitBars(symbolInfo, params)

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
    disconnect,
  }
}
