import { isEmpty, last } from 'lodash'

import { useKLineApi } from '../use-kline-api'
import { useKLineFormat } from '../use-kline-format'
import { useDatafeedCache } from '../use-datafeed-cache'
import { useTagParser } from '../use-tag-parser'

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
  } = useTagParser()

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
    const lastBar = last(bars)
    const parsedParams = joinParams(
      tagIsCex(received?.tag)
        ? cexTagToCexParams(received?.tag as CexTag)
        : dexTagToDexParams(received?.tag as DexTag)
    )
    const fallbackBar = { open: 0, high: 0, low: 0, close: 0, time: 0 }

    cachedApi.setLastBar(lastBar || fallbackBar)
    cachedApi.setLastTag(received.tag!)
    Object.assign(symbolInfo, {
      exchange: parsedParams.source.toUpperCase(),
      listed_exchange: parsedParams.source,
    } as typeof symbolInfo)

    return { bars, lastBar: lastBar || fallbackBar }
  }

  // Handle init bars & switch interval,
  const handleInitBars = async (
    symbolInfo: LibrarySymbolInfo,
    params: CexParams | DexParams,
    resolution: ResolutionString // used for switch interval
  ) => {
    try {
      // If `lastResolution` is exist,
      // it means that the user is switching time granularity.
      const lastResolution = cachedApi.getLastResolution()

      // If the `resolution` is the same as the last time,
      // it means repeat, should be return.
      if (lastResolution && lastResolution === resolution) return []

      // Switching `resolution` should be unlisten and listen again.
      // but, `getInitBars` has already been handled unlisten.
      if (lastResolution) {
        // This is switch interval
        const { bars } = await getInitBars(symbolInfo, {
          ...params,
          interval: toNormalInterval(resolution),
        })

        return bars
      }

      const cachedBars = cachedApi.getInitBars()
      const { bars } = isEmpty(cachedBars)
        ? await getInitBars(symbolInfo, params)
        : { bars: cachedBars }

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
