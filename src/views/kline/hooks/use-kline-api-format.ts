import {
  CexParams,
  CexTag,
  ChartTokenParams,
  DexParams,
  DexTag,
  TagString,
} from './use-kline-api/types'

export const useKLineApiFormat = () => {
  const cexParamsToCexTag = (p: CexParams) => {
    const str = ['cex', p.exchange, p.symbol, p.interval].join(':')
    return str as CexTag
  }

  const dexParamsToDexTag = (p: DexParams) => {
    const str = ['dex', p.chain, p.address, p.pool, p.interval].join(':')
    return str as DexTag
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
    dexParamsToDexTag,
    cexParamsToCexTag,
    dexTagToDexParams,
    cexTagToCexParams,
    joinParams,
    tagIsCex: (tag?: TagString) => !!tag?.startsWith('cex'),
    tagIsDex: (tag?: TagString) => !!tag?.startsWith('dex'),
  }
}
