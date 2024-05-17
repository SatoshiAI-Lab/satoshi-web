import { excluedToken, mainToken } from '@/config/coin'

export const utilToken = {
  isMainToken(symbol: string) {
    for (const name of mainToken) {
      if (name.toUpperCase() === symbol.toUpperCase()) {
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
