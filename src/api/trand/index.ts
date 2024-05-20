import { fetchSatoshi } from '..'
import {
  BuyTokenData,
  BuyTokenParams,
  CrossFeeData,
  CrossPriceQuery,
  CrossStatusQuery,
  CrossSwapData,
  CrossSwapParams,
} from './types'

export const trandApi = {
  /**
   * 单链交易
   */
  swapToken(walletId: string, data: BuyTokenParams) {
    return fetchSatoshi.post<BuyTokenData>(
      `/api/v1/wallet-transaction/${walletId}/`,
      data
    )
  },
  /**
   * 跨链交易
   */
  crossSwap(walletId: string, data: CrossSwapParams) {
    return fetchSatoshi.post<CrossSwapData>(
      `/api/v1/coin/cross/${walletId}/`,
      data
    )
  },
  /**
   * 查询跨链手续费
   */
  getCrossFee(data: CrossPriceQuery) {
    return fetchSatoshi.post<CrossFeeData>(`/api/v1/coin/cross-quote/`, data)
  },
  /**
   * 查询跨链进度
   * @returns
   */
  getCrossStatus(query: CrossStatusQuery) {
    return fetchSatoshi.get<CrossFeeData>(`/api/v1/coin/cross-status/`, query)
  },
}
