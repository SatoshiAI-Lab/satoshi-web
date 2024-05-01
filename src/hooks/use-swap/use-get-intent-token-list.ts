import { ChatResponseTxConfrim, MultiChainCoin } from '@/api/chat/types'
import { tokenApi } from '@/api/token'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useFetchOnlyKey } from '../use-fetch-only-key'
import { useWalletStore } from '@/stores/use-wallet-store'
import { utilWallet } from '@/utils/wallet'

interface Options {
  data: ChatResponseTxConfrim
}
export const useGetIntentTokenList = ({ data }: Options) => {
  const { walletList } = useWalletStore() // 所有的钱包

  const [fromTokenInfo, setFromTokenInfo] = useState(data?.from_token?.content)
  const [fromIntentChain, setFromIntentChain] = useState(data?.chain_name)
  const toTokenInfo = data.to_token.content
  const { onlyQueryKey: onlyFromTokenQueryKey } = useFetchOnlyKey()
  const { onlyQueryKey: onlyToTokenQueryKey } = useFetchOnlyKey()

  const sortByHolders = (tokenList: MultiChainCoin[]) => {
    return tokenList.sort((a, b) => b.holders - a.holders)
  } // 获取fromToken在全部链的代币信息
  const {
    data: fromTokenListData,
    isLoading: loadingFromTokenList,
    isSuccess,
  } = useQuery({
    queryKey: ['from-token-list', fromTokenInfo, onlyFromTokenQueryKey.current],
    queryFn: async () => {
      const { data } = await tokenApi.multiCoin(fromTokenInfo)
      return sortByHolders(data)
    },
  })

  const { data: toTokenListData, isLoading: loadingToTokenList } = useQuery({
    queryKey: ['to-token-list', toTokenInfo, onlyToTokenQueryKey.current],
    queryFn: async () => {
      const { data } = await tokenApi.multiCoin(toTokenInfo)
      return sortByHolders(data)
    },
  })

  const { fromTokenList, toTokenList } = useMemo(() => {
    let toTokenList: MultiChainCoin[] = toTokenListData || []
    let fromTokenList: MultiChainCoin[] = fromTokenListData || []

    // 支持跨链情况下可以不需要这些处理
    if (fromTokenInfo == '') {
      fromTokenList = utilWallet.getMainToken(walletList) || []
    }

    if (toTokenInfo == '') {
      toTokenList = utilWallet.getMainToken(walletList) || []
    }

    fromTokenList =
      fromTokenList?.filter((fromToken) => {
        return toTokenList?.some((toToken) => {
          if (fromToken.chain.id == toToken.chain.id) {
            if (!toTokenList.includes(toToken)) {
              toTokenList.push(toToken)
            }
            return true
          }
        })
      }) ?? []

    return {
      fromTokenList,
      toTokenList,
    }
  }, [toTokenListData, fromTokenListData])

  return {
    fromTokenInfo,
    fromIntentChain,
    fromTokenListResult: sortByHolders(fromTokenList),
    toTokenListResult: sortByHolders(toTokenList),
    loadingFromTokenList,
    loadingToTokenList,
    toTokenInfo,
    isSuccess,
    // 用于From/To代币余额不足，主动帮他切成ETH
    setFromTokenInfo,
    setFromIntentChain,
  }
}

export type TIntentTokoenInfo = ReturnType<typeof useGetIntentTokenList>
