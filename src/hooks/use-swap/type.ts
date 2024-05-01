import {
  MultiChainCoin,
  ChatResponseWalletListToken,
  ChatResponseTxConfrim,
} from '@/api/chat/types'
import { PartialWalletRes } from '@/stores/use-wallet-store'
import { Dispatch, SetStateAction } from 'react'

export interface ITxLogicContext {
  curRate: number
  isFinalTx: boolean
  validateErr: string[]
  isSwaping: boolean
  buyValue: number
  slippage: number

  onConfirm: () => any
  showSwaping: () => void
  closeSwaping: () => void
  setSlippage: Dispatch<SetStateAction<number>>
  setBuyValue: Dispatch<SetStateAction<number>>
  setCurRate: Dispatch<SetStateAction<number>>
  handleRateClick: (rate: number) => void
  getSelectTokenInfo: (
    wallet?: PartialWalletRes,
    token?: MultiChainCoin
  ) => ChatResponseWalletListToken | undefined
}

export interface ISwapContext {
  data?: ChatResponseTxConfrim
  checkedWallet: PartialWalletRes[]
  fromTokenList?: MultiChainCoin[]
  toTokenList: MultiChainCoin[]
  loadingToTokenList: boolean
  loadingFromTokenList: boolean
  selectToToken: MultiChainCoin | undefined
  selectFromToken: MultiChainCoin | undefined
  currentWallet?: PartialWalletRes
  autoCheckoutTokenMsg: string
  setCurrentWallet: Dispatch<SetStateAction<PartialWalletRes | undefined>>
  setFromTokenList: Dispatch<SetStateAction<MultiChainCoin[]>>
  setToTokenList: Dispatch<SetStateAction<MultiChainCoin[]>>
  setSelectToToken: Dispatch<SetStateAction<MultiChainCoin | undefined>>
  setSelectFromToken: Dispatch<SetStateAction<MultiChainCoin | undefined>>
}
