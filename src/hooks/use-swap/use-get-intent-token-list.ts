import { ChatResponseTxConfrim, MultiChainCoin } from '@/api/chat/types'
import { tokenApi } from '@/api/token'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useOnlyKey } from '../use-only-key'
import { utilSwap } from '@/utils/swap'
import { PartialWalletRes, WalletPlatform } from '@/stores/use-wallet-store'
import { useChainsPlatforms } from '@/components/wallet/hooks/use-chains-platforms'
import { utilToken } from '@/utils/token'

interface Options {
  data: ChatResponseTxConfrim
  walletList: PartialWalletRes[]
  walletPlatform: WalletPlatform
  loadingAllWallet: boolean
}
export const useGetIntentTokenList = (options: Options) => {
  const { data, walletList, walletPlatform, loadingAllWallet } = options
  const { to_token, from_token } = data
  const [fromTokenInfo, setFromTokenInfo] = useState(from_token?.content)
  const [toTokenInfo, setToTokenInfo] = useState(to_token.content)
  const [fromIntentChain, setFromIntentChain] = useState(from_token.chain_name)
  const [toIntentChain, setToIntentChain] = useState(to_token.chain_name)
  const { onlyQueryKey: onlyFromTokenQueryKey } = useOnlyKey()
  const { onlyQueryKey: onlyToTokenQueryKey } = useOnlyKey()
  const { chains } = useChainsPlatforms()

  // 如果是主链代币那么就默认设置成''
  const fromMainToken = utilSwap.getMainToken(walletList, fromTokenInfo)
  if (
    fromMainToken?.length &&
    fromTokenInfo !== '' &&
    utilToken.isMainToken(fromTokenInfo)
  ) {
    setFromTokenInfo('')
  }

  const toMainToken = utilSwap.getMainToken(walletList, toTokenInfo)
  if (
    toMainToken?.length &&
    toTokenInfo !== '' &&
    utilToken.isMainToken(toTokenInfo)
  ) {
    setToTokenInfo('')
  }

  const handleSearchTokenData = (searchTokenList?: MultiChainCoin[]) => {
    return searchTokenList?.map((token) => {
      const platform = chains.find((c) => c.name === token.chain.name)?.platform
      if (!platform || !walletPlatform[platform]) return token
      const wallets = walletPlatform[platform]!
      for (const wallet of wallets) {
        const wToken = wallet.tokens.find((t) => {
          return (
            t.chain.id === token.chain.id &&
            t.address === token.address &&
            t.value_usd
          )
        })
        if (wToken) {
          return {
            ...token,
            ...wToken,
          }
        }
      }
      return token
    })
  }

  // 获取fromToken在全部链的代币信息
  const {
    data: fromTokenListData,
    isLoading: loadingFromTokenList,
    isSuccess,
  } = useQuery({
    queryKey: [
      'from-token-list',
      fromTokenInfo,
      onlyFromTokenQueryKey.current,
      loadingAllWallet,
    ],
    queryFn: async () => {
      if (fromTokenInfo === '' || loadingAllWallet) {
        return undefined
      }

      const { data } = await tokenApi.multiCoin(fromTokenInfo)
      return handleSearchTokenData(utilSwap.sortByHolders(data))
    },
    retry: 2,
    refetchOnWindowFocus: false,
  })

  const { data: toTokenListData, isLoading: loadingToTokenList } = useQuery({
    queryKey: [
      'to-token-list',
      toTokenInfo,
      onlyToTokenQueryKey.current,
      loadingAllWallet,
    ],
    queryFn: async () => {
      if (toTokenInfo === '' || loadingAllWallet) {
        return undefined
      }

      const { data } = await tokenApi.multiCoin(toTokenInfo)
      return handleSearchTokenData(utilSwap.sortByHolders(data))
    },
    retry: 2,
    refetchOnWindowFocus: false,
  })

  return {
    fromTokenInfo,
    fromIntentChain,
    toIntentChain,
    fromMainToken,
    toMainToken,
    fromTokenListResult: fromTokenListData,
    toTokenListResult: toTokenListData,
    loadingFromTokenList,
    loadingToTokenList,
    toTokenInfo,
    isSuccess,
    // 用于From/To代币余额不足，主动帮他切成ETH
    setFromTokenInfo,
    setFromIntentChain,
    setToIntentChain,
  }
}

export type TIntentTokoenInfo = ReturnType<typeof useGetIntentTokenList>
