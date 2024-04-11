import {
  CexParams,
  CexTag,
  ChartTokenParams,
  DexParams,
  DexTag,
  TagString,
} from './use-kline-api/types'

type TagToParamsReturn<T extends boolean> = T extends true
  ? ChartTokenParams
  : CexParams | DexParams

export const useTagParser = () => {
  const tagIsCex = (tag?: TagString) => !!tag?.startsWith('cex')

  const tagIsDex = (tag?: TagString) => !!tag?.startsWith('dex')

  const paramsIsCex = (p: CexParams | DexParams) => p.type === 'cex'

  const paramsIsDex = (p: CexParams | DexParams) => p.type === 'dex'

  const cexParamsToCexTag = (p: Omit<CexParams, 'type'>) => {
    const str = ['cex', p.exchange, p.symbol, p.interval].join(':')
    return str as CexTag
  }

  const dexParamsToDexTag = (p: Omit<DexParams, 'type'>) => {
    const str = ['dex', p.chain, p.address, p.pool, p.interval].join(':')
    return str as DexTag
  }

  const paramsToTag = (p: CexParams | DexParams) => {
    if (p.type === 'cex') {
      return cexParamsToCexTag(p)
    }

    return dexParamsToDexTag(p)
  }

  const cexTagToCexParams = (tag?: CexTag) => {
    if (!tag) return {} as CexParams

    const [type, exchange, symbol, interval] = tag.split(':')
    return {
      type,
      exchange,
      symbol,
      interval,
    } as CexParams
  }

  const dexTagToDexParams = (tag?: DexTag) => {
    if (!tag) return {} as DexParams

    const [type, chain, address, pool, interval] = tag.split(':')
    return {
      type,
      chain,
      address,
      pool,
      interval,
    } as DexParams
  }

  const tagToParams = <T extends boolean = false>(
    tag: TagString,
    autoJoin: T = false as T
  ) => {
    if (tagIsCex(tag)) {
      const cexParams = cexTagToCexParams(tag as CexTag)
      const result = autoJoin ? joinParams(cexParams) : cexParams

      return result as TagToParamsReturn<T>
    }

    const dexParams = dexTagToDexParams(tag as DexTag)
    const result = autoJoin ? joinParams(dexParams) : dexParams

    return result as TagToParamsReturn<T>
  }

  const joinParams = (tag: CexParams | DexParams) => {
    if (tag.type === 'cex') {
      return {
        ...tag,
        source: tag.exchange,
        symbol: tag.symbol,
        interval: tag.interval,
      } as ChartTokenParams
    }

    return {
      ...tag,
      source: tag.chain,
      symbol: tag.address,
      interval: tag.interval,
    } as ChartTokenParams
  }

  return {
    tagIsCex,
    tagIsDex,
    paramsIsCex,
    paramsIsDex,
    cexParamsToCexTag,
    dexParamsToDexTag,
    paramsToTag,
    cexTagToCexParams,
    dexTagToDexParams,
    tagToParams,
    joinParams,
  }
}
