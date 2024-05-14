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
import { excluedCoin } from '@/config/stablecoin'
import { zeroAddr } from '@/config/address'
import { utilSwap } from '@/utils/swap'

interface Options {
  data: ChatResponseTxConfrim
  walletList: PartialWalletRes[]
  intentTokenInfo: TIntentTokoenInfo
}

export const useTxFromToken = (options: Options) => {
  const { walletList, intentTokenInfo } = options

  const {
    fromTokenListResult,
    loadingFromTokenList,
    toTokenListResult,
    fromIntentChain,
    fromTokenInfo,
    toTokenInfo,
  } = intentTokenInfo

  const { t } = useTranslation()

  const [selectFromToken, setSelectFromToken] = useState<MultiChainCoin>()
  const [fromTokenList, setFromTokenList] = useState(fromTokenListResult)
  const [insufficientBalanceMsg, setInsufficientBalanceMsg] = useState('')

  const getCheckedTokenFn = () => {
    let selectToken: MultiChainCoin | null = null

    // 如果有意图链则找出意图链的代币
    const tokenList = fromIntentChain
      ? fromTokenListResult?.filter((t) => t.chain.name === fromIntentChain)
      : fromTokenListResult

    const findIntentToken = (token: MultiChainCoin) => {
      // 如果From是稳定币之类的代币，那么优先选择最接近用户意图的To代币的链
      // （1）用户说：用USDC换成PYTH，则优先选择最多PYTH持币人的链的
      // （2）用户说：用Base链的USDC换成PYTH，那么则优先选择Base链
      if (
        excluedCoin.includes(token.name) ||
        excluedCoin.includes(token.symbol)
      ) {
        const chainId = toTokenListResult?.[0].chain.id
        if (
          (fromIntentChain && fromIntentChain === token.chain.name) ||
          token.chain.id === chainId
        ) {
          selectToken = token
        }
        return true
      }

      for (const w of walletList) {
        for (const wt of w.tokens!) {
          // 如果用户指定意图链，那么则不能记录命中的代币
          if (fromIntentChain && token.chain.name != fromIntentChain) {
            return false
          }

          // 搜索出来的代币和钱包的余额的代币地址一致
          if (
            token.address === wt.address &&
            token.chain.id == w!.chain!.id
            // && wt.value_usd > 0
          ) {
            // 优先选择用户意图的链的代币
            if (token.chain.name === fromIntentChain) {
              selectToken = token

              return true
            }

            // 如果这个代币的链是持币人最多的，那么可以选择这条链
            // toTokenListResult[0]是持币人最多的 toToken
            if (
              toTokenListResult?.[0].chain.name == w.chain?.id &&
              !selectToken
            ) {
              selectToken = token
              return true
            }
          }
        }
      }
    }

    const toMainToken = () => {
      // 情况一：买PYTH
      // 这种情况下默认给他主链代币
      // 有余额的情况下选择有余额的代币
      // 没有余额的情况下选择第一个代币，但是提示余额不足

      // 情况二：在BASE链买CAT
      // 这种情况下需要选择Base链的主代币

      const wallets = fromIntentChain
        ? walletList.filter((w) => w.chain?.name === fromIntentChain)
        : walletList

      // 判断To是否是链主代币
      const toIsMainToken = utilSwap.getMainToken(wallets, toTokenInfo)

      if (toIsMainToken) return []

      let firstMainToken: MultiChainCoin | undefined
      const toToTokenChianId = toTokenListResult?.[0].chain.id

      for (const w of wallets) {
        if (
          fromIntentChain == w.chain?.name ||
          w.chain?.id === toToTokenChianId
        ) {
          const token = w.tokens?.find((t) => t.address === zeroAddr)
          if (token) {
            const tokenFormat = {
              ...token,
              is_supported: true,
              holders: 10000,
            } as unknown as MultiChainCoin

            // 有意图链就优先意图链
            if (token.value_usd > 0) {
              selectToken = tokenFormat
              return [tokenFormat]
            }

            // 没有意图链就找To对应的链
            if (!selectToken) {
              selectToken = tokenFormat
            }
          }
        }
      }
      if (!firstMainToken) return []
      return [firstMainToken!]
    }

    let checkedTokenList =
      fromTokenInfo === '' ? toMainToken() : tokenList?.filter(findIntentToken)

    if (!selectToken) {
      for (const fromToken of fromTokenListResult || []) {
        if (fromToken.chain.id === toTokenListResult?.[0].chain.id) {
          setSelectFromToken(fromToken)
        }
      }
      return setInsufficientBalanceMsg(
        t('insufficient.balance').replace('$1', fromTokenInfo)
      )
    }

    // 没有用户意图链的代币情况，就选择默认选择持币人最多代币
    if (!selectFromToken) {
      setSelectFromToken(selectToken)
    }

    if (checkedTokenList?.length !== fromTokenList?.length) {
      setFromTokenList(checkedTokenList)
    }
  }

  useEffect(() => {
    if (
      // 获取From代币数据 || 本身不需要获取数据
      (fromTokenListResult?.length || fromTokenInfo === '') &&
      toTokenListResult?.length
    ) {
      getCheckedTokenFn()
    }
  }, [fromTokenListResult, toTokenListResult])

  return {
    fromTokenList,
    loadingFromTokenList,
    selectFromToken,
    insufficientBalanceMsg,
    setSelectFromToken,
    setFromTokenList,
  }
}
