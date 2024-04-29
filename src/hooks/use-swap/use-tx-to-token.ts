import { ChatResponseTxConfrim, MultiChainCoin } from '@/api/chat/types'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TIntentTokoenInfo } from './use-get-intent-token-list'

interface Options {
  selectFromToken?: MultiChainCoin
  data: ChatResponseTxConfrim
  fromTokenList: MultiChainCoin[]
  intentTokenInfo: TIntentTokoenInfo
}

export const useTxToToken = (options: Options) => {
  const { selectFromToken, intentTokenInfo } = options

  const { toTokenListResult, loadingToTokenList, fromIntentChain } =
    intentTokenInfo

  const { t } = useTranslation()

  const [selectToToken, setSelectToToken] = useState<MultiChainCoin>()
  const [toTokenList, setToTokenList] = useState(toTokenListResult ?? [])

  const getCheckedTokenFn = (tokenList?: MultiChainCoin[]) => {
    let checkedTokenList: MultiChainCoin[] | undefined = []

    const filterTokenByChainName = () => {
      checkedTokenList = tokenList?.filter((token) => {
        if (selectFromToken?.chain.name === token.chain.name) {
          // 提供了意图链 && 当前代币不属于意图链
          if (fromIntentChain && fromIntentChain != token.chain.name) {
            return true
          }
          setSelectToToken(token)
          return true
        }
      })
    }

    filterTokenByChainName()

    // 将持币人最多的代币作为默认选中代币
    setSelectToToken(checkedTokenList?.[0])
    setToTokenList(checkedTokenList || [])
  }

  useEffect(() => {
    if (toTokenListResult?.length) {
      getCheckedTokenFn(toTokenListResult)
    }
    // 当选择的代币改变后，需要自动选择对应链的代币
  }, [toTokenListResult, selectFromToken])

  return {
    toTokenList,
    loadingToTokenList,
    selectToToken,
    setToTokenList,
    setSelectToToken,
  }
}
