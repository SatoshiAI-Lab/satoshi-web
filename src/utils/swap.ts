import { ChatResponseWalletListToken, MultiChainCoin } from '@/api/chat/types'
import { zeroAddr } from '@/config/address'
import { PartialWalletRes } from '@/stores/use-wallet-store'
import { utilToken } from './token'
import { ChainResInfo } from '@/api/wallet/params'

export const utilSwap = {
  sortByMarkeCap: (tokenList?: MultiChainCoin[]) => {
    return tokenList
      ?.sort((a, b) => Number(b.liquidity) - Number(a.liquidity))
      .sort((a, b) => Number(b.holders) - Number(a.holders))
  },
  getMainToken: (
    walletList: PartialWalletRes[],
    chains: ChainResInfo[],
    tokenName: string
  ) => {
    const mainTokenList: MultiChainCoin[] = []

    walletList?.forEach((w) => {
      return w?.tokens?.find((t) => {
        const isMainToken =
          t.address === zeroAddr && utilToken.isMainToken(chains, tokenName)

        if (isMainToken) {
          mainTokenList.push({
            ...t,
            is_supported: true,
            holders: 1000000,
            price_change: t.price_change_24h,
            market_cap: '0',
            liquidity: '0',
          })
        }

        return isMainToken
      })
    })

    return mainTokenList
  },
  isTokenBaseInfo(
    toekn: MultiChainCoin | ChatResponseWalletListToken,
    info: string
  ) {
    info = info.toLowerCase()

    return (
      toekn.symbol.toLowerCase() === info ||
      toekn.name.toLowerCase() === info ||
      toekn.address.toLowerCase() === info
    )
  },
}
