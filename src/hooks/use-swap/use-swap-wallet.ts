import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
  PartialWalletRes,
  WalletPlatform,
  useWalletStore,
} from '@/stores/use-wallet-store'
import { MultiChainCoin } from '@/api/chat/types'

interface Options {
  selectFromToken?: MultiChainCoin
  selectToToken?: MultiChainCoin
  fromWallet?: PartialWalletRes
  receiveWallet?: PartialWalletRes
  setFromWallet: Dispatch<SetStateAction<PartialWalletRes | undefined>>
  setReceiveWallet: Dispatch<SetStateAction<PartialWalletRes | undefined>>
}

export const useSwapWallet = (options: Options) => {
  const { walletList } = useWalletStore()
  const {
    selectFromToken,
    selectToToken,
    fromWallet,
    setFromWallet,
    setReceiveWallet,
  } = options
  const [shouldCreateReceiveWallet, setShouldCreateReceiveWallet] =
    useState(false)
  const [gridWalletList, setGridWalletList] = useState<PartialWalletRes[][]>([])

  const findTokenUsd = (wallet: PartialWalletRes) => {
    const token = wallet.tokens?.find(
      (t) => t.address == selectFromToken?.address
    )
    return token?.value_usd ?? 0
  }

  const handleWallet = () => {
    let count = 0

    // 筛选出和FromToken同一条链的钱包
    let wallets = walletList.filter(
      (w) => w?.chain?.id === selectFromToken?.chain?.id
    )
    setFromWallet(wallets[0])

    // 格式化数据成九宫格
    const gridWalletList = wallets
      .filter((w) =>
        w.tokens?.some((t) => {
          return (
            t.value_usd > 0 &&
            t.address === selectFromToken?.address &&
            t.name === selectFromToken?.name
          )
        })
      )
      .reduce<PartialWalletRes[][]>((cur, next) => {
        if (count % 3 == 0) {
          cur.push([])
        }
        cur[cur.length - 1].push(next)
        count++
        return cur
      }, [])
    const defaultWallet = gridWalletList[0]?.[0]

    if (
      defaultWallet &&
      // 链ID和钱包ID都必须是不一致的
      // 这里和跨不跨链无关，因为选择的代币必须用这条链的钱包支付
      (defaultWallet.id !== fromWallet?.id ||
        defaultWallet.chain?.id != fromWallet?.chain?.id)
    ) {
      setGridWalletList(gridWalletList)
      if (defaultWallet?.chain?.id !== fromWallet?.chain?.id) {
        setFromWallet(defaultWallet)
      }
    }
  }

  const handleReceiveWallet = () => {
    const wallets = walletList.filter(
      (w) => w?.chain?.id === selectToToken?.chain?.id
    )

    if (!wallets.length) {
      setShouldCreateReceiveWallet(true)
      return
    }

    wallets.sort((a, b) => {
      let x = 0
      let y = 0

      a.tokens?.find((t) => {
        if (t.address === selectToToken?.address && t.amount) {
          x = t.value_usd
          return true
        }
      })

      b.tokens?.find((t) => {
        if (t.address === selectToToken?.address && t.amount) {
          y = t.value_usd
          return true
        }
      })

      return y - x
    })

    setReceiveWallet(wallets[0])
  }

  useEffect(() => {
    if (selectFromToken) {
      handleWallet()
    }
  }, [selectFromToken])

  useEffect(() => {
    if (selectToToken) {
      handleReceiveWallet()
    }
  }, [selectToToken])

  return {
    gridWalletList,
    selectFromToken,
    shouldCreateReceiveWallet,
    findTokenUsd,
  }
}
