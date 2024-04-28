import { ChatResponseTxConfrim } from '@/api/chat/types'
import { useTxFromToken } from './use-tx-from-token'
import { useTxToToken } from './use-tx-to-token'

interface Options {
  isBuy: boolean
  data: ChatResponseTxConfrim
}

export const useSwapProviderProvider = ({ isBuy, data }: Options) => {
  const {
    checkedWallet,
    fromTokenList,
    loadingFromTokenList,
    selectFromToken,
    replaceWithETHInfo,
    setSelectFromToken,
    setFromTokenList,
    refreshFromTokenList,
  } = useTxFromToken({
    isBuy,
    data,
  })

  const {
    toTokenList,
    loadingToTokenList,
    selectToToken,
    setSelectToToken,
    setToTokenList,
  } = useTxToToken({
    selectFromToken,
    data,
    refreshFromTokenList,
  })

  const contextValue = {
    isBuy,
    data,
    checkedWallet,
    fromTokenList,
    toTokenList,
    loadingToTokenList,
    loadingFromTokenList,
    selectToToken,
    selectFromToken,
    replaceWithETHInfo,
    setSelectToToken,
    setSelectFromToken,
    setFromTokenList,
    setToTokenList,
  }

  return { contextValue, ...contextValue }
}
