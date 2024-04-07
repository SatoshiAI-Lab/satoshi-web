import { useQuery } from '@tanstack/react-query'

import { tokenApi } from '@/api/token'
import { useFavtokenStore } from '@/stores/use-favorites-store'
import { useEffect } from 'react'

const defaultTokens = {
  ids: [
    { type: 1, id: 1 }, // BTC
    { type: 1, id: 141 }, // ETH
    { type: 1, id: 1563 }, // SOL
    { type: 1, id: 325 }, // BNB
    { type: 1, id: 26 }, // DOGE
    { type: 1, id: 1785 }, // SHIB
  ],
}

export const useFavorites = (intervalFetch = true) => {
  const { tokenList, setTokenList } = useFavtokenStore()
  const {
    data: tokenData,
    isLoading: isFirstLoadingToken,
    isFetching: isFetchingToken,
    isRefetching: isRefetchingToken,
    refetch: refetchTokens,
  } = useQuery({
    refetchInterval: intervalFetch && 30_000, // Each 30 seconds refresh token list.
    queryKey: [tokenApi.tokenList.name],
    queryFn: () => tokenApi.tokenList(defaultTokens),
  })

  useEffect(() => {
    setTokenList(tokenData?.data.list ?? [])
  }, [tokenData])

  return {
    tokenList,
    isFirstLoadingToken,
    isFetchingToken,
    isRefetchingToken,
    refetchTokens,
  }
}
