import {
  ChatResponseTxConfrim,
  ChatResponseWalletListToken,
  MultiChainCoin,
} from '@/api/chat/types'
import { PartialWalletRes } from '@/stores/use-wallet-store'
import { useEffect, useState } from 'react'
import { TIntentTokoenInfo } from './use-get-intent-token-list'
import { excluedToken } from '@/config/coin'
import { utilArr } from '@/utils/array'
import { utilSwap } from '@/utils/swap'

interface Options {
  data?: ChatResponseTxConfrim
  walletList: PartialWalletRes[]
  intentTokenInfo: TIntentTokoenInfo
}

export const useSwapSelectToken = (options: Options) => {
  const { data, intentTokenInfo } = options

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

  const includesStablecoin = (token?: MultiChainCoin | string) => {
    if (typeof token === 'string') {
      return excluedToken.includes(token)
    } else {
      return (
        !!token &&
        (excluedToken.includes(token.symbol) ||
          excluedToken.includes(token.name))
      )
    }
  }

  const isEqTokenBaseInfo = (
    token: ChatResponseWalletListToken | MultiChainCoin,
    info: string
  ) => {
    return (
      token.symbol === info || token.name === info || token.address === info
    )
  }

  const surceFromTokneInfo = data?.from_token.content!
  const isFromMainToken = fromTokenInfo === ''
  const isToMainToken = toTokenInfo === ''
  const isFromStableToken = includesStablecoin(fromTokenInfo)
  const isToStableToken = includesStablecoin(toTokenInfo)

  // From Token
  const [selectFromToken, setSelectFromToken] = useState<MultiChainCoin>()
  // From Token List
  const [fromTokenList, setFromTokenList] = useState(fromTokenListResult)
  // To Token
  const [selectToToken, setSelectToToken] = useState<MultiChainCoin>()
  // To Token List
  const [toTokenList, setToTokenList] = useState(toTokenListResult)

  let fromToken: MultiChainCoin | undefined
  let toToken: MultiChainCoin | undefined

  const handleFromToken = () => {
    const handlMainOrStableToken = () => {
      // To是稳定币或者主代币
      if (isToStableToken || isToMainToken) {
        return (fromMainToken || []).filter((t) => {
          // 存在意图
          if (fromIntentChain !== '') {
            return t?.chain.name === fromIntentChain
          }
          return t.value_usd && isEqTokenBaseInfo(t, surceFromTokneInfo)
        })
      }

      if (isFromMainToken) {
        // 主代币
        const tokenList = fromMainToken.filter((t) => {
          // 意图链
          if (fromIntentChain !== '') {
            return t?.chain.name === fromIntentChain
          }

          const token = t as unknown as ChatResponseWalletListToken

          return (
            // 对比代币链是否和To代币链一致
            (token.chain.id === toToken?.chain.id ||
              // 如果是 购买PYTH 则surceFromTokneInfo === ''
              (surceFromTokneInfo !== '' &&
                // 代币基础信息是否和意图代币信息一致
                isEqTokenBaseInfo(token, surceFromTokneInfo))) &&
            token.value_usd
          )
        })

        if (!tokenList.length) {
          return [fromMainToken[0]]
        }

        return tokenList
      } else {
        // 稳定币
        const tokenList = (fromTokenListResult || []).filter((t) => {
          const token = t as unknown as ChatResponseWalletListToken
          return token.chain.id === toToken?.chain.id && token.value_usd
        })

        // 匹配情况6
        // 稳定币没有余额，没有指定指定的链，给他切换到有余额的链
        if (!tokenList?.length && fromIntentChain === '') {
          return fromTokenListResult?.filter((t) => {
            const token = t as unknown as ChatResponseWalletListToken
            return token.value_usd && isEqTokenBaseInfo(token, fromTokenInfo)
          })
        }

        // 代币列表
        if (!tokenList?.length && fromTokenListResult) {
          return [fromTokenListResult[0]]
        }

        return tokenList
      }
    }

    const isStablecoin = isFromStableToken
    let tokenList: MultiChainCoin[] =
      (isFromMainToken || isStablecoin
        ? handlMainOrStableToken()
        : fromTokenListResult) || []

    if (fromIntentChain !== '') {
      //处理意图链
      let beforeFilterTokenList = tokenList
      tokenList = beforeFilterTokenList.filter(
        (t) => t.chain.name === fromIntentChain
      )
    } else if (isFromStableToken) {
      // 处理稳定币交易
      tokenList = tokenList.filter((t) => t.value_usd! > 0)
    }

    // 没有匹配到合适的代币
    if (!tokenList?.length) {
      return
    }

    // 匹配情况6
    // 使用ETH购买PYTH，当SOL也有余额时匹配成SOL购买PYTH
    if (
      isFromMainToken &&
      surceFromTokneInfo !== '' &&
      tokenList[0].name !== surceFromTokneInfo
    ) {
      tokenList.find((token) => {
        if (isEqTokenBaseInfo(token, surceFromTokneInfo)) {
          fromToken = token
          setSelectFromToken(token)
          return true
        }
      })
    } else {
      fromToken = tokenList[0]
      setSelectFromToken(tokenList[0])
    }

    setFromTokenList(tokenList)
  }

  const handleToToken = () => {
    let tokenList: MultiChainCoin[] = isToMainToken
      ? toMainToken
      : toTokenListResult || []

    // 主代币
    if (toMainToken) {
      const tokenList = utilArr.removeDuplicates(toMainToken, [
        'address',
        'chain.id',
      ])

      const mainToken = tokenList.find((token) => {
        if (toIntentChain !== '') {
          return token.chain.name === toIntentChain
        } else {
          isEqTokenBaseInfo(token, data?.to_token.content!)
        }
      })

      toToken = mainToken
      setSelectToToken(mainToken)
      setToTokenList(tokenList)
      return
    }

    // 稳定币
    if (isToStableToken) {
      // 意图链
      const token = tokenList.find((t) => {
        if (toIntentChain !== '') {
          return t.chain.name === toIntentChain
        } else {
          return t.chain.name === fromToken?.chain.name
        }
      })

      toToken = token
      setSelectToToken(token)
      setToTokenList(tokenList)
      return
    }

    if (toIntentChain !== '') {
      // 优先匹配意图链
      let beforeFilterTokenList = tokenList
      tokenList = beforeFilterTokenList.filter(
        (t) => t.chain.name === toIntentChain
      )
    }

    // 没有匹配到合适的代币
    if (tokenList.length === 0) {
      return
    }

    setSelectToToken(tokenList[0])
    setToTokenList(tokenList)

    toToken = tokenList[0]
  }

  useEffect(() => {
    if (
      (fromTokenListResult?.length || fromTokenInfo === '') &&
      (toTokenListResult?.length || toTokenInfo === '') &&
      !loadingToTokenList &&
      !loadingFromTokenList
    ) {
      // From是稳定币或者主代币
      if (isFromMainToken || isFromStableToken) {
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
