import { CexParams, CexTag, DexParams, DexTag } from './use-kline-api/types'

export const useKLineApiFormat = () => {
  const toDexTag = (p: DexParams) => {
    const str = ['dex', p.chain, p.address, p.pool, p.interval].join(':')
    return str as DexTag
  }

  const toCexTag = (p: CexParams) => {
    const str = ['cex', p.exchange, p.symbol, p.interval].join(':')
    return str as CexTag
  }

  const parseDexTag = (tag?: DexTag) => {
    if (!tag) return {} as DexParams

    const [, chain, address, pool, interval] = tag.split(':')
    return {
      chain,
      address,
      pool,
      interval,
    } as DexParams
  }

  const parseCexTag = (tag?: CexTag) => {
    if (!tag) return {} as CexParams

    const [, exchange, symbol, interval] = tag.split(':')
    return {
      exchange,
      symbol,
      interval,
    } as CexParams
  }

  return {
    toDexTag,
    toCexTag,
    parseDexTag,
    parseCexTag,
  }
}
