import { PartialWalletRes } from '@/stores/use-wallet-store'

export const utilWallet = {
  sortWalletByCreated: <T extends PartialWalletRes>(wallets?: T[]) => {
    return wallets?.sort(
      (a, b) =>
        new Date(b?.added_at || 0).getTime() -
        new Date(a.added_at || 0).getTime()
    ) as T[]
  },
}
