import { ChatResponseTxConfrim, MultiChainCoin } from '@/api/chat/types'
import { Dispatch, SetStateAction, createContext, useState } from 'react'
import { PartialWalletRes } from '@/stores/use-wallet-store'
import { useWalletStore } from '@/stores/use-wallet-store'
import {
  TIntentTokoenInfo,
  useGetIntentTokenList,
} from './use-get-intent-token-list'
import { useSwapWallet } from './use-swap-wallet'
import { useSwapSelectToken } from './use-swap-select-token'

interface Options {
  data: ChatResponseTxConfrim
}

export interface ISwapContext {
  data?: ChatResponseTxConfrim
  fromTokenList?: MultiChainCoin[]
  toTokenList?: MultiChainCoin[]
  loadingToTokenList: boolean
  loadingFromTokenList: boolean
  selectToToken: MultiChainCoin | undefined
  selectFromToken: MultiChainCoin | undefined
  fromWallet?: PartialWalletRes
  insufficientBalanceMsg: string
  gridWalletList: PartialWalletRes[][]
  walletList: PartialWalletRes[]
  loadingAllWallet: boolean
  intentTokenInfo?: TIntentTokoenInfo
  toWallet?: PartialWalletRes

  setToWallet: Dispatch<SetStateAction<PartialWalletRes | undefined>>
  setFromWallet: Dispatch<SetStateAction<PartialWalletRes | undefined>>
  setFromTokenList: Dispatch<SetStateAction<MultiChainCoin[] | undefined>>
  setToTokenList: Dispatch<SetStateAction<MultiChainCoin[] | undefined>>
  setSelectToToken: Dispatch<SetStateAction<MultiChainCoin | undefined>>
  setSelectFromToken: Dispatch<SetStateAction<MultiChainCoin | undefined>>
  findTokenUsd: (wallet: PartialWalletRes) => number
}

export const SwapContext = createContext<ISwapContext>({
  data: undefined,
  fromTokenList: [],
  toTokenList: [],
  loadingToTokenList: false,
  loadingFromTokenList: false,
  selectToToken: undefined,
  selectFromToken: undefined,
  fromWallet: undefined,
  insufficientBalanceMsg: '',
  gridWalletList: [],
  walletList: [],
  loadingAllWallet: true,
  intentTokenInfo: undefined,
  toWallet: undefined,
  setToWallet: () => {},
  setFromWallet: () => {},
  setSelectFromToken: () => {},
  setSelectToToken: () => {},
  setFromTokenList: () => {},
  setToTokenList: () => {},
  findTokenUsd: (w) => 0,
})

export const useSwapProviderProvider = ({ data }: Options) => {
  const { walletList, loadingAllWallet } = useWalletStore() // 所有的钱包
  // 用于支付代币的钱包
  const [fromWallet, setFromWallet] = useState<PartialWalletRes | undefined>()
  // 用于接收代币的钱包
  const [toWallet, setToWallet] = useState<PartialWalletRes | undefined>()

  const intentTokenInfo = useGetIntentTokenList({
    data,
    walletList,
  })

  const {
    fromTokenList,
    loadingFromTokenList,
    loadingToTokenList,
    selectFromToken,
    selectToToken,
    toTokenList,
    setFromTokenList,
    setSelectFromToken,
    setSelectToToken,
    setToTokenList,
  } = useSwapSelectToken({ intentTokenInfo, walletList })

  const { gridWalletList, findTokenUsd } = useSwapWallet({
    selectFromToken,
    fromWallet,
    setFromWallet,
  })

  const contextValue = {
    data,
    fromTokenList,
    toTokenList,
    loadingToTokenList,
    loadingFromTokenList,
    selectToToken,
    selectFromToken,
    fromWallet,
    gridWalletList,
    insufficientBalanceMsg: '',
    toWallet,
    setToWallet,
    setFromWallet,
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
