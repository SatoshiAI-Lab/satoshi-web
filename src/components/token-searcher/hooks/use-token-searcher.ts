import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { tokenApi } from '@/api/token'
import { TokenSearchCoin } from '@/api/token/types'
import { useFavorites } from '@/components/favorites/hooks/use-favorites'
import { utilArr } from '@/utils/array'

export const useTokenSearcher = () => {
  const [keyword, search] = useState('')
  const [coins, setCoins] = useState<TokenSearchCoin[]>([])
  const { tokenList, isRefetchingToken, isSelecting, selectToken } =
    useFavorites({
      intervalFetch: false,
      enabled: false,
    })
  const { data: searchResult, isFetching: isSearching } = useQuery({
    enabled: !!keyword.trim(),
    queryKey: [tokenApi.search.name, keyword],
    queryFn: () => {
      if (!keyword.trim()) return null
      return tokenApi.search(keyword)
    },
  })
  const coinsList = searchResult?.data?.coin ?? []

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
