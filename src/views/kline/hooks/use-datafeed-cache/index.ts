import type {
  Bar,
  ResolutionString,
} from '../../../../../public/tradingview/charting_library/charting_library'
import type { Pair } from '@/types/types'
import type { TagString } from '../use-kline-api/types'

export type ResetCacheMap<T = Function> = Map<string, T>

/** Unified manage datafeed caches. */
export const useDatafeedCache = () => {
  const cachedMap = new Map<string, any>()

  return {
    getLastBar: () => cachedMap.get('lastBar') as Bar,
    setLastBar: (bar: Bar) => cachedMap.set('lastBar', bar),

    getInitBars: () => cachedMap.get('initBars') as Bar[],
    setInitBars: (bars: Bar[]) => cachedMap.set('initBars', bars),

    getLastResolution: () => cachedMap.get('lastRes') as ResolutionString,
    setLastResolution: (r: ResolutionString) => cachedMap.set('lastRes', r),

    getLastSourcePair: () => cachedMap.get('lastSourcePair') as Pair,
    setLastSourcePair: (p: Pair) => cachedMap.set('lastSourcePair', p),

    getLastTag: () => cachedMap.get('lastTag') as TagString,
    setLastTag: (tag: TagString) => cachedMap.set('lastTag', tag),

    resetCacheMap: new Map() as ResetCacheMap,
  }
}
