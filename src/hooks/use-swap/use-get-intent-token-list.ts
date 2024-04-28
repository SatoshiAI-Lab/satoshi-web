import { ChatResponseTxConfrim } from '@/api/chat/types'
import { tokenApi } from '@/api/token'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useFetchOnlyKey } from '../use-fetch-only-key'

interface Options {
  data: ChatResponseTxConfrim
}
export const useGetIntentTokenList = ({ data }: Options) => {
  const [fromTokenInfo, setFromTokenInfo] = useState(data?.from_token?.content)
  const [fromIntentChain, setFromIntentChain] = useState(data?.chain_name)
  const { onlyQueryKey: onlyFromTokenQueryKey } = useFetchOnlyKey()
  const toTokenInfo = data.to_token.content
  const { onlyQueryKey: onlyToTokenQueryKey } = useFetchOnlyKey()

  // 获取fromToken在全部链的代币信息
  const {
    data: fromTokenListData,
    isLoading: loadingFromTokenList,
    isSuccess,
  } = useQuery({
    queryKey: ['from-token-list', fromTokenInfo, onlyFromTokenQueryKey.current],
    queryFn: async () => {
      const { data } = await tokenApi.multiCoin(fromTokenInfo)
      return data.sort((a, b) => b.holders - a.holders)
    },
  })

  const { data: toTokenListData, isLoading: loadingToTokenList } = useQuery({
    queryKey: ['to-token-list', toTokenInfo, onlyToTokenQueryKey.current],
    queryFn: async () => {
      const { data } = await tokenApi.multiCoin(toTokenInfo)
      return data.sort((a, b) => b.holders - a.holders)
    },
  })

  return {
    fromTokenInfo,
    fromIntentChain,
    fromTokenListData,
    loadingFromTokenList,
    loadingToTokenList,
    toTokenInfo,
    isSuccess,
    toTokenListData,
    setFromTokenInfo,
    setFromIntentChain,
  }
}
