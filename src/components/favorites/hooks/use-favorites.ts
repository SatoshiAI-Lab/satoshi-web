import { useEffect } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'

import { tokenApi } from '@/api/token'
import { useFavtokenStore } from '@/stores/use-favorites-store'
import { ListToken, SelectParams, TokenType } from '@/api/token/types'
import { SortType } from '@/types/types'

const defaultTokens = {
  ids: [
    { type: TokenType.Token, id: 1 }, // BTC
    { type: TokenType.Token, id: 141 }, // ETH
    { type: TokenType.Token, id: 1563 }, // SOL
    { type: TokenType.Token, id: 325 }, // BNB
    { type: TokenType.Token, id: 26 }, // DOGE
    { type: TokenType.Token, id: 1785 }, // SHIB
    { type: TokenType.Token, id: 180450 }, // PYTH
    { type: TokenType.Token, id: 182461 }, // BOME
    { type: TokenType.Token, id: 2792 }, // ICP
    { type: TokenType.Token, id: 3978 }, // OP
  ],
}

export enum FavoritesSort {
  Default,
  Price,
  Percent,
}

interface Options {
  intervalFetch?: boolean
  enabled?: boolean
  sortBy?: FavoritesSort
  sortType?: SortType
}

export const useFavorites = (opts?: Options) => {
  const {
    intervalFetch = true,
    enabled = true,
    sortBy = FavoritesSort.Default,
    sortType = SortType.Desc,
  } = opts ?? {}
  const { t } = useTranslation()
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

  const {
    isPending: isSelecting,
    isError: isSelectError,
    mutateAsync: mutateToken,
  } = useMutation({
    mutationKey: [tokenApi.select.name],
    mutationFn: (params: SelectParams) => tokenApi.select(params),
  })

  const selectToken = async (params: SelectParams) => {
    try {
      await mutateToken(params)
    } catch (error) {
      toast.error(t('select-token.failed'))
    } finally {
      await refetchTokens() // whatever, refresh token list.
    }
  }

  const sortTokens = (list: ListToken[]) => {
    if (isEmpty(list)) return list
    if (sortBy === FavoritesSort.Default) return list

    if (sortBy === FavoritesSort.Price) {
      list.sort((a, b) => {
        const priceA = a.price
        const priceB = b.price

        return sortType === SortType.Desc ? priceB - priceA : priceA - priceB
      })

      return list
    }

    if (sortBy === FavoritesSort.Percent) {
      list.sort((a, b) => {
        const percentA = a.percent_change_24_h
        const percentB = b.percent_change_24_h

        return sortType === SortType.Desc
          ? percentB - percentA
          : percentA - percentB
      })
      return list
    }

    return list
  }

  useEffect(() => {
    const tokens = sortTokens(tokenData?.data.list ?? [])

    setTokenList(tokens)
  }, [tokenData])

  return {
    tokenList,
    isFirstLoadingToken,
    isFetchingToken,
    isRefetchingToken,
    isSelecting,
    isSelectError,
    refetchTokens,
    selectToken,
  }
}
