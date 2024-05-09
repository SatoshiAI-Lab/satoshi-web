import { ChatResponseTxConfrim, MultiChainCoin } from '@/api/chat/types'
import { useEffect, useState } from 'react'
import { TIntentTokoenInfo } from './use-get-intent-token-list'

interface Options {
  selectFromToken?: MultiChainCoin
  data: ChatResponseTxConfrim
  fromTokenList?: MultiChainCoin[]
  intentTokenInfo: TIntentTokoenInfo
}

export const useTxToToken = (options: Options) => {
  const { selectFromToken, intentTokenInfo } = options

  const { toTokenListResult, loadingToTokenList, fromIntentChain } =
    intentTokenInfo

  const [selectToToken, setSelectToToken] = useState<MultiChainCoin>()
  const [toTokenList, setToTokenList] = useState(toTokenListResult)

  const getCheckedTokenFn = (tokenList?: MultiChainCoin[]) => {
    const list = tokenList?.filter((t) => {
      // 按照意图链
      if (fromIntentChain) {
        return t.chain.name === fromIntentChain
      }
      // 按照持币人
      return t.chain.id === selectFromToken?.chain.id
    })
    setSelectToToken(list?.[0])
    setToTokenList(list)
  }

  useEffect(() => {
    if (toTokenListResult?.length) {
      getCheckedTokenFn(toTokenListResult)
    }
    // 当选择的代币改变后，需要自动选择对应链的代币
  }, [toTokenListResult])

  return {
    toTokenList,
    loadingToTokenList,
    selectToToken,
    setToTokenList,
    setSelectToToken,
  }
}
