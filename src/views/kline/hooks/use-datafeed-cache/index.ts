import type {
  Bar,
  ResolutionString,
} from '../../../../../public/tradingview/charting_library/charting_library'
import type { VoidFn, Pair } from '@/types/types'
import type { TagString } from '../use-kline-api/types'

export type ResetCacheMap<T = Function> = Map<string, T>

/** Unified manage datafeed caches. */
export const useDatafeedCache = () => {
  const cachedMap = new Map<string, any>()
  const subscribeCacheMap = new Map<string, VoidFn>()

  return {
    // `resolveSymbol` cached bars's last one.
    getLastBar: () => cachedMap.get('lastBar') as Bar,
    setLastBar: (bar: Bar) => cachedMap.set('lastBar', bar),

    // `resolveSymbol` cached bars
    getInitBars: () => cachedMap.get('initBars') as Bar[],
    setInitBars: (bars: Bar[]) => cachedMap.set('initBars', bars),

    // Last one resolution.
    getLastResolution: () => cachedMap.get('lastRes') as ResolutionString,
    setLastResolution: (r: ResolutionString) => cachedMap.set('lastRes', r),

    // Not needed at the moment.
    getLastSourcePair: () => cachedMap.get('lastSourcePair') as Pair,
    setLastSourcePair: (p: Pair) => cachedMap.set('lastSourcePair', p),

    // API's tag
    getLastTag: () => cachedMap.get('lastTag') as TagString,
    setLastTag: (tag: TagString) => cachedMap.set('lastTag', tag),

    // Subscribe update cache.
    getSubscribe: (uId: string) => subscribeCacheMap.get(uId),
    getSubscribes: () => subscribeCacheMap,
    setSubscribe: (uId: string, fn: VoidFn) => subscribeCacheMap.set(uId, fn),
    removeSubscribe: (uId: string) => subscribeCacheMap.delete(uId),
    clearSubscribe: () => subscribeCacheMap.clear(),
  }
}
