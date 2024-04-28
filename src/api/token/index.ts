import { MultiChainCoin } from '../chat/types'
import { fetchSatoshi } from './../index'

import type {
  TokenListParams,
  TokenSearchRes,
  TokenList,
  SelectParams,
  TokenId,
} from './types'

export const tokenApi = {
  tokenList(params: TokenListParams) {
    return fetchSatoshi.post<TokenList>('/api/v1/coin/list/', params)
  },
  search(kw: string) {
    return fetchSatoshi.get<TokenSearchRes>('/api/v1/coin/search/', { kw })
  },
  select(params: SelectParams) {
    return fetchSatoshi.post<TokenId[]>('/api/v1/coin/select/', params)
  },
  multiCoin(kw: string) {
    return fetchSatoshi.get<MultiChainCoin[]>('/api/v1/coin/query/', { kw })
  },
}
