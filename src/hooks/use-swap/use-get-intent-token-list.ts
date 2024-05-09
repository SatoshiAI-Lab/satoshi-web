import { ChatResponseTxConfrim, MultiChainCoin } from '@/api/chat/types'
import { tokenApi } from '@/api/token'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useFetchOnlyKey } from '../use-fetch-only-key'
import { utilSwap } from '@/utils/swap'
import { PartialWalletRes } from '@/stores/use-wallet-store'

interface Options {
  data: ChatResponseTxConfrim
  walletList: PartialWalletRes[]
}
export const useGetIntentTokenList = (options: Options) => {
  const { data, walletList } = options
  const [fromTokenInfo, setFromTokenInfo] = useState(data?.from_token?.content)
  const [toTokenInfo, setToTokenInfo] = useState(data.to_token.content)
  const [fromIntentChain, setFromIntentChain] = useState(data?.chain_name)
  const { onlyQueryKey: onlyFromTokenQueryKey } = useFetchOnlyKey()
  const { onlyQueryKey: onlyToTokenQueryKey } = useFetchOnlyKey()

  // 如果是主链代币那么就默认设置成''
  const fromIsMainToken = utilSwap.isMainToken(walletList, fromTokenInfo)
  if (fromIsMainToken) {
    setFromTokenInfo('')
  }
  const toIsMainToken = utilSwap.isMainToken(walletList, toTokenInfo)
  if (toIsMainToken) {
    setToTokenInfo('')
  }

  // 获取fromToken在全部链的代币信息
  const {
    data: fromTokenListData,
    isLoading: loadingFromTokenList,
    isSuccess,
  } = useQuery({
    queryKey: ['from-token-list', fromTokenInfo, onlyFromTokenQueryKey.current],
    queryFn: async () => {
      if (fromTokenInfo === '') {
        return undefined
      }

      const { data } = await tokenApi.multiCoin(fromTokenInfo)
      return utilSwap.sortByHolders(data)
    },
    retry: 2,
    refetchOnWindowFocus: false,
  })

  const { data: toTokenListData, isLoading: loadingToTokenList } = useQuery({
    queryKey: ['to-token-list', toTokenInfo, onlyToTokenQueryKey.current],
    queryFn: async () => {
      if (toTokenInfo === '') {
        return undefined
      }

      const { data } = await tokenApi.multiCoin(toTokenInfo)
      return utilSwap.sortByHolders(data)
    },
    retry: 2,
    refetchOnWindowFocus: false,
  })

  return {
    fromTokenInfo,
    fromIntentChain,
    fromTokenListResult: fromTokenListData,
    toTokenListResult: toTokenListData,
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
