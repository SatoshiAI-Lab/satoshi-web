import { fetchSatoshi } from '..'
import { BuyTokenData, BuyTokenParams, CrossSwapParams } from './types'

export const trandApi = {
  swapToken(walletId: string, data: BuyTokenParams) {
    return fetchSatoshi.post<BuyTokenData>(
      `/api/v1/wallet-transaction/${walletId}/`,
      data
    )
  },
  crossSwap(walletId: string, data: CrossSwapParams) {
    return fetchSatoshi.post<BuyTokenData>(
      `/api/v1/wallet-transaction/${walletId}/`,
      data
    )
  },
}
