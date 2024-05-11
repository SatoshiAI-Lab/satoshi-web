import { MultiChainCoin } from '@/api/chat/types'
import { PartialWalletRes } from '@/stores/use-wallet-store'
import { useEffect, useState } from 'react'
import { TIntentTokoenInfo } from './use-get-intent-token-list'
import { useTranslation } from 'react-i18next'
import { excluedCoin } from '@/config/stablecoin'

interface Options {
  walletList: PartialWalletRes[]
  intentTokenInfo: TIntentTokoenInfo
}

export const useSwapSelectToken = (options: Options) => {
  const { walletList, intentTokenInfo } = options

  const {
    toTokenInfo,
    fromTokenInfo,
    fromIntentChain,
    toIntentChain,
    fromTokenListResult,
    loadingFromTokenList,
    loadingToTokenList,
    toTokenListResult,
    fromMainToken,
    toMainToken,
  } = intentTokenInfo

  const isFromMainToken = fromTokenInfo === ''
  const isToMainToken = toTokenInfo === ''
  const includesStablecoin = (tokenName: string) =>
    excluedCoin.includes(tokenName) || excluedCoin.includes(tokenName)

  // From Token
  const [selectFromToken, setSelectFromToken] = useState<MultiChainCoin>()
  // From Token List
  const [fromTokenList, setFromTokenList] = useState(fromTokenListResult)
  // To Token
  const [selectToToken, setSelectToToken] = useState<MultiChainCoin>()
  // To Token List
  const [toTokenList, setToTokenList] = useState(toTokenListResult)

  let fromTokenChainId = ''
  let toTokenChainId = ''

  const handleFromToken = () => {
    let tokenList: MultiChainCoin[] = isFromMainToken
      ? fromMainToken.filter((t) => t.chain.id === toTokenChainId)
      : fromTokenListResult || []

    // Intentional chain
    if (fromIntentChain !== '') {
      let beforeFilterTokenList = tokenList
      tokenList = beforeFilterTokenList.filter(
        (t) => t.chain.name === fromIntentChain
      )
    } else if (includesStablecoin(fromTokenInfo)) {
      // 需要由ToToken决定主代币以及稳定币的链
      tokenList = tokenList.filter((t) => t.chain.id === toTokenChainId)
    }

    // 没有匹配到合适的代币
    if (tokenList.length === 0) {
      return
    }

    setSelectFromToken(tokenList[0])
    setFromTokenList(tokenList)
    fromTokenChainId = tokenList[0].chain.id
  }

  const handleToToken = () => {
    let tokenList: MultiChainCoin[] = isToMainToken
      ? toMainToken.filter((t) => t.chain.id === fromTokenChainId)
      : toTokenListResult || []

    // Intentional chain
    if (toIntentChain !== '') {
      let beforeFilterTokenList = tokenList
      // Main Token
      if (isToMainToken) {
        beforeFilterTokenList = toMainToken
      }
      tokenList = beforeFilterTokenList.filter(
        (t) => t.chain.name === toIntentChain
      )
    } else if (includesStablecoin(toTokenInfo)) {
      // 需要由ToToken决定主代币以及稳定币的链
      tokenList = tokenList.filter((t) => t.chain.id === toTokenChainId)
    }

    // 没有匹配到合适的代币
    if (tokenList.length === 0) {
      return
    }

    console.log('To Token List:', tokenList)
    setSelectToToken(tokenList[0])
    setToTokenList(tokenList)

    toTokenChainId = tokenList[0].chain.id
  }

  useEffect(() => {
    if (
      (fromTokenListResult?.length || fromTokenInfo === '') &&
      (toTokenListResult?.length || toTokenInfo === '') &&
      !loadingToTokenList &&
      !loadingFromTokenList
    ) {
      // 是主代币 || 稳定币
      if (isFromMainToken || includesStablecoin(fromTokenInfo)) {
        handleToToken()
        handleFromToken()
      } else {
        handleFromToken()
        handleToToken()
      }
    }
  }, [
    fromTokenListResult,
    toTokenListResult,
    loadingToTokenList,
    loadingFromTokenList,
  ])

  return {
    fromTokenList,
    loadingFromTokenList,
    loadingToTokenList,
    selectFromToken,
    selectToToken,
    toTokenList,
    setSelectFromToken,
    setSelectToToken,
    setFromTokenList,
    setToTokenList,
  }
}
