import { MultiChainCoin } from '@/api/chat/types'
import { zeroAddr } from '@/config/address'
import { PartialWalletRes } from '@/stores/use-wallet-store'

export const utilWallet = {
  sortWalletByCreated: <T extends PartialWalletRes>(wallets?: T[]) => {
    return wallets?.sort(
      (a, b) =>
        new Date(b?.added_at || 0).getTime() -
        new Date(a.added_at || 0).getTime()
    ) as T[]
  },
  getMainToken(wallets: PartialWalletRes[]) {
    const mainToken: MultiChainCoin[] = []

    const someToken = (t: MultiChainCoin, w: PartialWalletRes) => {
      return t?.name == t.name && t.chain.id == w?.chain?.id
    }

    wallets.forEach((w) => {
      const token = w.tokens?.find(
        (t) =>
          t.address == zeroAddr &&
          t.value_usd > 0 &&
          !mainToken.some((t) => someToken(t, w))
      )
      if (token) {
        mainToken.push({
          ...token,
          chain: w.chain!,
          is_supported: true,
          logo: token.logo,
          price_change: token.price_change_24h,
          holders: 10000,
        })
      }
    })

    return mainToken
  },
}
