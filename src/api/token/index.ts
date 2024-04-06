import { fetchSatoshiChain } from './../index'

import type { TokenListParams, TokenResponse } from './types'

export const tokenApi = {
  tokenList(params: TokenListParams) {
    return fetchSatoshiChain.post<TokenResponse>('/token/list', params)
  },
}
