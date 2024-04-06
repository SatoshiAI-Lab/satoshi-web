import { fetchSatoshi } from './../index'

import type { TokenListParams, TokenResponse } from './types'

export const tokenApi = {
  tokenList(params: TokenListParams) {
    return fetchSatoshi.post<TokenResponse>('/token/list', params)
  },
}
