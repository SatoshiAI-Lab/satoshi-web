import { fetchSatoshi } from '..'
import { BuyTokenData, BuyTokenParams } from './types'

export const trandApi = {
  buyToken(walletId: string, data: BuyTokenParams) {
    return fetchSatoshi.post<BuyTokenData>(
      `/api/v1/wallet-transaction/${walletId}/`,
      data
    )
  },
}
