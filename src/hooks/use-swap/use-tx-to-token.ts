import { ChatResponseTxConfrim, MultiChainCoin } from '@/api/chat/types'
import { useEffect, useState } from 'react'
import { zeroAddr } from '@/config/address'
import { useTranslation } from 'react-i18next'
import { useGetIntentTokenList } from './use-get-intent-token-list'
import { useSwapWallet } from './use-swap-wallet'

interface Options {
  selectFromToken?: MultiChainCoin
  data: ChatResponseTxConfrim
  refreshFromTokenList: (tokenList?: MultiChainCoin[] | undefined) => void
}

export const useTxToToken = (options: Options) => {
  const { selectFromToken, data, refreshFromTokenList } = options

  const {
    toTokenInfo,
    toTokenListData,
    fromTokenListData,
    loadingToTokenList,
    fromIntentChain,
  } = useGetIntentTokenList({ data })

  const { t } = useTranslation()
  const { walletList } = useSwapWallet()

  const [selectToToken, setSelectToToken] = useState<MultiChainCoin>()
  const [toTokenList, setToTokenList] = useState(toTokenListData ?? [])

  const [toNotFindToken, setToNotFindToken] = useState('')

  const getCheckedTokenFn = (tokenList?: MultiChainCoin[]) => {
    let checkedTokenList: MultiChainCoin[] | undefined = []

    const hasMainToken = () => {
      for (const wallet of walletList) {
        wallet.tokens?.some((t) => {
          const isIdenticalChain = selectFromToken?.chain.id == wallet.chain?.id
          // 找主链代币 && 和From代币同一条链
          if (t.address === zeroAddr && isIdenticalChain) {
            const token = {
              ...t,
              address: t.address,
              chain: wallet.chain!,
              is_supported: true,
              logo: t.logoUrl,
              price_change: 0,
              price_usd: t.price_usd,
              holders: 1000,
            }

            // 默认选中和fromToken同一条链的代币
            if (isIdenticalChain) {
              setSelectToToken(token)
            }

            checkedTokenList?.push(token)
            return true
          }
        })
      }
    }

    const filterTokenByChainName = () => {
      let checkedFromTokenList: MultiChainCoin[] = []
      checkedTokenList = tokenList?.filter((token) => {
        // 如果ToToken没FromToken的链，则不展示FromToken
        const fromToken = fromTokenListData
          // .sort((a, b) => b.holders - a.holders)
          ?.find(
            (t) =>
              t.chain.id == token.chain.id && !checkedFromTokenList.includes(t)
          )

        if (fromToken) {
          checkedFromTokenList.push(fromToken)
        }

        if (selectFromToken?.chain.name === token.chain.name) {
          // 提供了意图链 && 当前代币不属于意图链
          if (fromIntentChain && fromIntentChain != token.chain.name) {
            return true
          }
          // 选择同链的代币作为默认选中
          // !selectToToken &&
          setSelectToToken(token)
          return true
        }
      })
      // if (fromTokenListData?.length !== checkedFromTokenList.length) {
      //   refreshFromTokenList(checkedFromTokenList)
      // }
    }

    if (toTokenInfo == '') {
      // 没指定代币 默认为主代币
      hasMainToken()
    } else {
      // 通过SelectFrom的链名筛选出对应的To代币
      filterTokenByChainName()
    }

    // 提示用户无可兑换的代币
    if (!checkedTokenList.length) {
      setToNotFindToken(t('to.not.find.token'))
      return
    }

    // checkedTokenList?.sort((a, b) => b.holders - a.holders)

    // 将持币人最多的代币作为默认选中代币
    setSelectToToken(checkedTokenList?.[0])
    setToTokenList(checkedTokenList || [])
  }

  useEffect(() => {
    if (toTokenListData?.length || toTokenInfo == '') {
      getCheckedTokenFn(toTokenListData)
    }
  }, [toTokenListData, toTokenInfo, selectFromToken])

  // useEffect(() => {
  //   if (toTokenListData) getCheckedTokenFn(toTokenListData)
  // }, [selectFromToken])

  return {
    toTokenList,
    loadingToTokenList,
    selectToToken,
    setToTokenList,
    setSelectToToken,
  }
}
