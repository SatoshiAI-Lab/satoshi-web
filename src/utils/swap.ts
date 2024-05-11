import { MultiChainCoin } from '@/api/chat/types'
import { zeroAddr } from '@/config/address'
import { PartialWalletRes } from '@/stores/use-wallet-store'

export const utilSwap = {
  sortByHolders: (tokenList?: MultiChainCoin[]) => {
    return tokenList?.sort((a, b) => (b.holders || 0) - (a.holders || 0))
  },
  getMainToken: (walletList?: PartialWalletRes[], tokenName?: string) => {
    const mainTokenList: MultiChainCoin[] = []

    walletList?.forEach((w) => {
      return w?.tokens?.find((t) => {
        const isMainToken =
          t.address === zeroAddr &&
          (tokenName === '' ||
            t.name === tokenName ||
            t.symbol === tokenName ||
            t.address === tokenName)

        if (isMainToken) {
          mainTokenList.push({
            ...t,
            is_supported: true,
            holders: 1000000,
            price_change: t.price_change_24h,
          })
        }

        return isMainToken
      })
    })

    return mainTokenList
  },
}
