import { ChatResponseTxConfrim } from '@/api/chat/types'
import { useTxFromToken } from './use-tx-from-token'
import { useTxToToken } from './use-tx-to-token'
import { createContext, useState } from 'react'
import { PartialWalletRes } from '@/stores/use-wallet-store'
import { useWalletStore } from '@/stores/use-wallet-store'
import { useGetIntentTokenList } from './use-get-intent-token-list'
import { ISwapContext } from './type'
import { useSwapWallet } from './use-swap-wallet'

interface Options {
  data: ChatResponseTxConfrim
}

export const SwapContext = createContext<ISwapContext>({
  data: undefined,
  checkedWallet: [],
  fromTokenList: [],
  toTokenList: [],
  loadingToTokenList: false,
  loadingFromTokenList: false,
  selectToToken: undefined,
  selectFromToken: undefined,
  currentWallet: undefined,
  insufficientBalanceMsg: '',
  gridWalletList: [],
  walletList: [],
  loadingAllWallet: true,
  intentTokenInfo: undefined,
  setCurrentWallet: () => {},
  setSelectFromToken: () => {},
  setSelectToToken: () => {},
  setFromTokenList: () => {},
  setToTokenList: () => {},
  findTokenUsd: (w) => 0,
})

export const useSwapProviderProvider = ({ data }: Options) => {
  const { walletList, loadingAllWallet } = useWalletStore() // 所有的钱包
  const [checkedWallet, setCheckedWallet] = useState<PartialWalletRes[]>([]) // 过滤后合格的钱包
  const [currentWallet, setCurrentWallet] = useState<
    // 当前选中的钱包
    PartialWalletRes | undefined
  >()

  const intentTokenInfo = useGetIntentTokenList({
    data,
    walletList,
  })

  const {
    fromTokenList,
    loadingFromTokenList,
    selectFromToken,
    insufficientBalanceMsg,
    setSelectFromToken,
    setFromTokenList,
  } = useTxFromToken({
    data,
    walletList,
    setCheckedWallet,
    intentTokenInfo,
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
    fromTokenList,
    intentTokenInfo,
  })

  const { gridWalletList, findTokenUsd } = useSwapWallet({
    selectFromToken,
    currentWallet,
    setCurrentWallet,
  })

  const contextValue = {
    data,
    checkedWallet,
    fromTokenList,
    toTokenList,
    loadingToTokenList,
    loadingFromTokenList,
    selectToToken,
    selectFromToken,
    currentWallet,
    gridWalletList,
    insufficientBalanceMsg,
    setCurrentWallet,
    setSelectToToken,
    setToTokenList,
    setSelectFromToken,
    setFromTokenList,
    findTokenUsd,
    walletList,
    loadingAllWallet,
    intentTokenInfo,
  }

  return { contextValue, ...contextValue }
}
