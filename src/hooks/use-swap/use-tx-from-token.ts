import { ChatResponseTxConfrim, MultiChainCoin } from '@/api/chat/types'
import { zeroAddr } from '@/config/address'
import { WalletCardProps, useWalletStore } from '@/stores/use-wallet-store'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetIntentTokenList } from './use-get-intent-token-list'
import toast from 'react-hot-toast'

interface Options {
  isBuy: boolean
  data: ChatResponseTxConfrim
}
export const useTxFromToken = (options: Options) => {
  const { data } = options

  const { t } = useTranslation()

  const [replaceWithETHInfo, setReplaceWithETHInfo] = useState('')

  const { walletList } = useWalletStore()

  const {
    fromTokenListData,
    fromIntentChain,
    fromTokenInfo,
    loadingFromTokenList,
    toTokenListData,
    toTokenInfo,
  } = useGetIntentTokenList({ data })

  const [selectFromToken, setSelectFromToken] = useState<MultiChainCoin>()
  const [fromTokenList, setFromTokenList] = useState(fromTokenListData ?? [])
  const [checkedWallet, setCheckedWallet] = useState<WalletCardProps[]>([])

  const getCheckedTokenFn = (tokenList?: MultiChainCoin[]) => {
    let checkedTokenList: MultiChainCoin[] = []

    const hasMainToken = (w: WalletCardProps) => {
      // 查找这条链有哪些钱包是有主代币的
      return w.tokens?.some((t) => {
        // 有余额的主代币
        if (t.address == zeroAddr && t.value_usd > 1) {
          toTokenListData

          // 不是用户想交易的链
          // if (fromIntentChain && w.chain?.name !== fromIntentChain) {
          //   return false
          // }

          // 去重
          const isInclude = checkedTokenList.some((token) => {
            token.address == t.address && token.chain.id == w.chain?.id
          })
          if (isInclude) return false

          checkedTokenList.push({
            ...t,
            chain: w.chain!,
            is_supported: true,
            logo: t.logoUrl,
            price_change: t.price_change_24h,
            price_usd: t.price_usd,
            holders: 1000,
          })
          return true
        }
      })
    }

    const findIntentToken = (w: WalletCardProps) => {
      const filterTokenList = tokenList?.filter((token) => {
        const chianID = w.chain?.id
        return w?.tokens?.some((t) => {
          // 代币地址正确 && 代币和链正确 && 代币余额大于1U
          if (
            token.address === t.address &&
            token.chain.id == chianID &&
            // token.name == t.name && // 数据缺失name可能是null
            t.value_usd > 1
          ) {
            // 不是用户想交易的链
            // if (fromIntentChain && fromIntentChain != token.chain.name) {
            //   return false
            // }

            // 选中意图链的代币
            // if (token.chain.name == fromIntentChain) {
            //   console.log(token.chain.name)

            //   setSelectFromToken(token)
            // }

            return true
          }
        })
      })

      if (filterTokenList?.length) {
        checkedTokenList.push(...filterTokenList)
        return true
      }
    }

    const selectDefaultToken = () => {
      const currentWallet = checkedWallet[0]

      // 选择默认选中的代币
      if (!selectFromToken) {
        let defaultSelect: MultiChainCoin | undefined
        if (fromIntentChain) {
          // 例如：用户提供了某条链，那么我还得将这条链的USDC做为默认选中的From交易币种
          defaultSelect = checkedTokenList.find(
            (token) => token.chain.name == fromIntentChain
          )
        } else if (currentWallet) {
          // 如果用户没有说想在什么链上买币，那么使用默认钱包的链
          defaultSelect = checkedTokenList.find(
            (t) => currentWallet.chain?.id == t.chain.id
          )
        } else {
          defaultSelect = checkedTokenList[0]
        }

        if (defaultSelect) {
          setSelectFromToken(defaultSelect)
        } else {
          toast.error(t('from.not.find.token').replace('$1', fromTokenInfo))
        }

        return defaultSelect
      }
    }

    let checkedWallet = walletList.filter((w) => {
      if (fromTokenInfo == '') {
        return hasMainToken(w)
      } else {
        // 例如：在很多链都有USDC的情况下，我只过滤出来我自己拥有某条链的USDC。
        return findIntentToken(w)
      }
    })

    // 按持有人降序
    checkedTokenList.sort((a, b) => b.holders - a.holders)

    // 有指定代币购买 && 钱包中指定的代币没有余额
    // 这种情况下，我们帮用户选中主链代币有余额的钱包
    // if (!checkedWallet.length && fromTokenInfo !== '') {
    //   checkedWallet = walletList.filter((w) => hasMainToken(w))
    //   if (checkedTokenList.length !== 0) {
    //     const defaultTOken = selectDefaultToken()
    //     setReplaceWithETHInfo(
    //       t('from.replace.token')
    //         .replace('$1', fromTokenInfo)
    //         .replace('$2', defaultTOken?.symbol ?? '')
    //     )
    //   }
    // }

    if (!checkedWallet.length) {
      toast.error(t('from.not.find.token').replace('$1', fromTokenInfo))
      return
    }

    setCheckedWallet(checkedWallet)

    selectDefaultToken()

    setFromTokenList(checkedTokenList)
  }

  useEffect(() => {
    if (
      // 获取From代币数据 || 本身不需要获取数据
      (fromTokenListData?.length || fromTokenInfo == '') &&
      // 获取To代币数据 || 本身不需要获取数据
      (toTokenListData?.length || toTokenInfo == '')
    ) {
      getCheckedTokenFn(fromTokenListData)
    }
  }, [fromTokenListData, toTokenListData])

  return {
    fromTokenList,
    checkedWallet,
    loadingFromTokenList,
    selectFromToken,
    replaceWithETHInfo,
    setSelectFromToken,
    setFromTokenList,
    refreshFromTokenList: getCheckedTokenFn,
  }
}
