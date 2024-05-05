import { ChatResponseTxConfrim, MultiChainCoin } from '@/api/chat/types'
import { PartialWalletRes } from '@/stores/use-wallet-store'
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from 'react'
import { TIntentTokoenInfo } from './use-get-intent-token-list'
import { useTranslation } from 'react-i18next'
import { ITxLogicContext } from './type'

interface Options {
  data: ChatResponseTxConfrim
  walletList: PartialWalletRes[]
  setCheckedWallet: Dispatch<SetStateAction<PartialWalletRes[]>>
  intentTokenInfo: TIntentTokoenInfo
}

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

export const useTxFromToken = (options: Options) => {
  const { walletList, intentTokenInfo } = options

  const {
    fromTokenListResult,
    loadingFromTokenList,
    toTokenListResult,
    fromTokenInfo,
    fromIntentChain,
    toTokenInfo,
    setFromTokenInfo,
  } = intentTokenInfo

  const { t } = useTranslation()

  const [selectFromToken, setSelectFromToken] = useState<MultiChainCoin>()
  const [fromTokenList, setFromTokenList] = useState(fromTokenListResult ?? [])

  const [autoCheckoutTokenMsg, setAutoCheckoutTokenMsg] = useState('')
  const [insufficientBalanceMsg, setInsufficientBalanceMsg] = useState('')

  const getCheckedTokenFn = () => {
    let selectToken: MultiChainCoin | null = null

    const findIntentToken = (token: MultiChainCoin) => {
      for (const w of walletList) {
        for (const wt of w.tokens!) {
          // 如果用户指定意图链，那么则不能记录命中的代币
          if (fromIntentChain && token.chain.name != fromIntentChain) {
            return false
          }

          if (
            token.address === wt.address &&
            token.chain.id == w!.chain!.id &&
            wt.value_usd > 1
          ) {
            // 优先选择用户意图的链的代币
            if (token.chain.name === fromIntentChain) {
              selectToken = token

              // 如果这个代币的链是持币人最多的，那么可以选择这条链
              // toTokenListResult[0]是持币人最多的 toToken
            } else if (
              toTokenListResult[0].chain.name == w.chain?.id &&
              !selectToken
            ) {
              selectToken = token
            }

            return true
          }
        }
      }
    }

    let checkedTokenList = fromTokenListResult?.filter(findIntentToken)
    const firstToken = selectToken || checkedTokenList[0]

    // 主动切换到主代币的规则：
    // 1. fromToken在所有的钱包里没有余额
    // 2. toToken必须不是主代币
    // 3. fromToken如果是主代币那么提示余额不足
    if (!firstToken && toTokenInfo != '') {
      if (fromTokenInfo == '') {
        // Gas都没有
        setInsufficientBalanceMsg(t('insufficient.balance'))
        return
      }

      setFromTokenInfo('')
      setAutoCheckoutTokenMsg(
        t('autp.checkout.token').replace('$1', fromTokenInfo)
      )
      return
    }

    // 没有用户意图链的代币情况，就选择默认选择持币人最多代币
    if (!selectFromToken) {
      // 需要做筛选
      // toTokenListResult.filter

      setSelectFromToken(firstToken)
    }

    if (checkedTokenList.length !== fromTokenList.length) {
      setFromTokenList(checkedTokenList)
    }
  }

  useEffect(() => {
    if (
      // 获取From代币数据 || 本身不需要获取数据
      fromTokenListResult.length &&
      toTokenListResult.length
    ) {
      getCheckedTokenFn()
    }
  }, [fromTokenListResult, toTokenListResult])

  return {
    fromTokenList,
    loadingFromTokenList,
    selectFromToken,
    autoCheckoutTokenMsg,
    insufficientBalanceMsg,
    setSelectFromToken,
    setFromTokenList,
  }
}
