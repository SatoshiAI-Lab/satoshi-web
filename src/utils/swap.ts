import { MultiChainCoin } from '@/api/chat/types'
import { zeroAddr } from '@/config/address'
import { PartialWalletRes } from '@/stores/use-wallet-store'

export const utilSwap = {
  sortByHolders: (tokenList?: MultiChainCoin[]) => {
    return tokenList?.sort((a, b) => (b.holders || 0) - (a.holders || 0))
  },
  isMainToken: (walletList?: PartialWalletRes[], tokenName?: string) => {
    return walletList?.find((w) => {
      return w?.tokens?.find(
        (t) =>
          t.address === zeroAddr &&
          (t.name === tokenName ||
            t.symbol === tokenName ||
            t.address === tokenName)
      )
    })
  },
}
