import { ChatResponseTxConfrim, MultiChainCoin } from '@/api/chat/types'
import { useEffect, useState } from 'react'
import { TIntentTokoenInfo } from './use-get-intent-token-list'
import { utilArr } from '@/utils/array'

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
    let list = tokenList?.filter((t) => {
      // 按照意图链
      if (fromIntentChain) {
        return t.chain.name === fromIntentChain
      }
      // 按照持币人
      return tokenList[0].chain.id === t.chain.id
    })
    list = list?.filter((item, i) => {
      for (const t of list?.slice(i + 1) || []) {
        if (item.address === t.address && item.chain.id === t.chain.id) {
          return false
        }
      }
      return true
    })

    console.log('list', list)

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
