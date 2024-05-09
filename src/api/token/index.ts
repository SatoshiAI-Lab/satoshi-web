import { MultiChainCoin } from '../chat/types'
import { fetchSatoshi } from './../index'

import type {
  TokenListParams,
  TokenSearchRes,
  TokenList,
  SelectParams,
  TokenId,
  TokenInfoReq,
  TokenInfoRes,
  QueryAddrReq,
  QueryAddrRes,
} from './types'

export const tokenApi = {
  tokenList(params: TokenListParams) {
    return fetchSatoshi.post<TokenList>('/api/v1/coin/list/', params)
  },
  search(kw: string) {
    return fetchSatoshi.get<TokenSearchRes>('/api/v1/coin/search/', { kw })
  },
  select(params: SelectParams) {
    return fetchSatoshi.get<TokenId[]>('/api/v1/coin/select/', params)
  },
  queryAddr(params: QueryAddrReq) {
    return fetchSatoshi.get<QueryAddrRes>('/api/v1/address/query/', params)
  },
  info(req: TokenInfoReq) {
    return fetchSatoshi.get<TokenInfoRes>('/api/v1/coin/info/', req)
  },
  multiCoin(kw: string) {
    return fetchSatoshi.get<MultiChainCoin[]>('/api/v1/coin/query/', { kw })
  },
}
