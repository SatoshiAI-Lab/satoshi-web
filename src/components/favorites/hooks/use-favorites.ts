import { useQuery } from '@tanstack/react-query'

import { tokenApi } from '@/api/token'

export const useFavorites = () => {
  const {
    data: tokenList,
    isLoading: isFirstLoadingToken,
    isFetching: isFetchingToken,
  } = useQuery({
    refetchInterval: 30_000, // Each 30 seconds refresh token list.
    queryKey: [tokenApi.tokenList.name],
    queryFn: () => {
      return tokenApi.tokenList({
        // Default tokens
        ids: [
          { type: 1, id: 1 }, // BTC
          { type: 1, id: 141 }, // ETH
          { type: 1, id: 1563 }, // SOL
          { type: 1, id: 325 }, // BNB
          { type: 1, id: 26 }, // DOGE
          { type: 1, id: 1785 }, // SHIB
        ],
      })
    },
  })
  const tList = (tokenList?.data.list ?? []).map((t) => t.token)

  return {
    tokenList: tList,
    isFirstLoadingToken,
    isFetchingToken,
  }
}
