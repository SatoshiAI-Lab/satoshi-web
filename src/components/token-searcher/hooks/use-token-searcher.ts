import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { isEmpty } from 'lodash'

import { tokenApi } from '@/api/token'
import { TokenSearchCoin } from '@/api/token/types'
import { useFavorites } from '@/components/favorites/hooks/use-favorites'

export const useTokenSearcher = () => {
  const [keyword, search] = useState('')
  const [coins, setCoins] = useState<TokenSearchCoin[]>([])
  const { tokenList, isRefetchingToken, isSelecting } = useFavorites({
    intervalFetch: false,
    enabled: false,
  })
  const { data: searchResult, isFetching: isSearching } = useQuery({
    enabled: !!keyword.trim(),
    queryKey: [tokenApi.search.name, keyword],
    queryFn: async () => {
      if (!keyword.trim()) return { coin: [] }
      const { data } = await tokenApi.search(keyword)
      return data
    },
  })
  const coinsList = searchResult?.coin ?? []

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
    if (isEmpty(coins)) {
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
    setCoins,
  }
}
