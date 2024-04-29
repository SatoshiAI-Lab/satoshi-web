import { createContext } from 'react'
import { ISwapContext, ITxLogicContext } from './type'

export const TxLogicContext = createContext<ITxLogicContext>({
  curRate: 0,
  isFinalTx: false,
  validateErr: [],
  isSwaping: false,
  buyValue: 0,
  slippage: 0,
  onConfirm: () => {},
  showSwaping: () => {},
  closeSwaping: () => {},
  setSlippage: () => {},
  setBuyValue: () => {},
  setCurRate: () => {},
  handleRateClick: (rate) => {},
  getSelectTokenInfo: (wallet) => undefined,
})

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
  setCurrentWallet: () => {},
  setSelectFromToken: () => {},
  setSelectToToken: () => {},
  setFromTokenList: () => {},
  setToTokenList: () => {},
})
