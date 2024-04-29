import { ChatResponseTxConfrim } from '@/api/chat/types'
import { useTxFromToken } from './use-tx-from-token'
import { useTxToToken } from './use-tx-to-token'
import { useState } from 'react'
import { PartialWalletRes } from '@/stores/use-wallet-store'

interface Options {
  isBuy: boolean
  data: ChatResponseTxConfrim
}

export const useSwapProviderProvider = ({ isBuy, data }: Options) => {
  const [currentWallet, setCurrentWallet] = useState<
    PartialWalletRes | undefined
  >()
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
    currentWallet,
    setCurrentWallet,
    setSelectToToken,
    setSelectFromToken,
    setFromTokenList,
    setToTokenList,
  }

  return { contextValue, ...contextValue }
}
