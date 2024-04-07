import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'

import { tokenApi } from '@/api/token'
import { SelectParams, TokenSearchCoin } from '@/api/token/types'
import { useFavorites } from '@/components/favorites/hooks/use-favorites'
import { utilArr } from '@/utils/array'

export const useTokenSearcher = () => {
  const [keyword, search] = useState('')
  const [coins, setCoins] = useState<TokenSearchCoin[]>([])
  const { tokenList, isRefetchingToken, refetchTokens } = useFavorites()
  const { data: searchResult, isFetching: isSearching } = useQuery({
    enabled: !!keyword.trim(),
    queryKey: [tokenApi.search.name, keyword],
    queryFn: () => {
      if (!keyword.trim()) return null
      return tokenApi.search(keyword)
    },
  })
  const coinsList = searchResult?.data?.coin ?? []

  const {
    isPending: isSelecting,
    isSuccess,
    isError,
    mutateAsync: selectToken,
  } = useMutation({
    mutationKey: [tokenApi.select.name],
    mutationFn: (params: SelectParams) => tokenApi.select(params),
  })

  const clearSearch = () => {
    search('')
    setCoins(tokenList)
  }

  useEffect(() => {
    if (searchResult) {
      setCoins(coinsList)
    }
  }, [searchResult])

  useEffect(() => {
    refetchTokens()
  }, [isSuccess, isError, refetchTokens])

  useEffect(() => {
    if (utilArr.isEmpty(coins)) {
      setCoins(tokenList)
    }
  }, [tokenList])

  return {
    coins,
    isSearching,
    isSelecting,
    isRefetchingToken,
    keyword,
    search,
    clearSearch,
    selectToken,
    setCoins,
  }
}
