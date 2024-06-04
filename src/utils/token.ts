import { ChainResInfo } from '@/api/wallet/params'
import { excluedToken } from '@/config/coin'

export const utilToken = {
  isMainToken(chains: ChainResInfo[], symbol: string) {
    symbol = symbol.toUpperCase()
    for (const name of chains) {
      if (
        name.token.name.toUpperCase() === symbol ||
        name.token.symbol.toUpperCase() === symbol
      ) {
        return true
      }
    }
    return false
  },
  isStaleToken(symbol: string) {
    for (const name of excluedToken) {
      if (name.toUpperCase() === symbol.toUpperCase()) {
        return true
      }
    }
    return false
  },
}
