import { useEffect } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'

import { tokenApi } from '@/api/token'
import { useFavtokenStore } from '@/stores/use-favorites-store'
import { SelectParams } from '@/api/token/types'

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

interface Options {
  intervalFetch?: boolean
  enabled?: boolean
}

export const useFavorites = (opts?: Options) => {
  const { intervalFetch = true, enabled = true } = opts ?? {}
  const { tokenList, setTokenList } = useFavtokenStore()
  const {
    data: tokenData,
    isLoading: isFirstLoadingToken,
    isFetching: isFetchingToken,
    isRefetching: isRefetchingToken,
    refetch: refetchTokens,
  } = useQuery({
    enabled,
    refetchInterval: intervalFetch && 30_000, // Each 30 seconds refresh token list.
    queryKey: [tokenApi.tokenList.name],
    queryFn: () => tokenApi.tokenList(defaultTokens),
  })

  const { isPending: isSelecting, mutateAsync: mutateToken } = useMutation({
    mutationKey: [tokenApi.select.name],
    mutationFn: (params: SelectParams) => tokenApi.select(params),
  })

  const selectToken = async (params: SelectParams) => {
    await mutateToken(params)
    await refetchTokens()
  }

  useEffect(() => {
    setTokenList(tokenData?.data.list ?? [])
  }, [tokenData])

  return {
    tokenList,
    isFirstLoadingToken,
    isFetchingToken,
    isRefetchingToken,
    isSelecting,
    refetchTokens,
    selectToken,
  }
}
