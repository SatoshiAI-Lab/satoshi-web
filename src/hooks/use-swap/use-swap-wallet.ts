import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { PartialWalletRes, useWalletStore } from '@/stores/use-wallet-store'
import { MultiChainCoin } from '@/api/chat/types'
import { utilWallet } from '@/utils/wallet'

interface Options {
  selectFromToken?: MultiChainCoin
  currentWallet?: PartialWalletRes
  setCurrentWallet?: Dispatch<SetStateAction<PartialWalletRes | undefined>>
}

export const useSwapWallet = (options: Options) => {
  const { walletList } = useWalletStore()
  const { selectFromToken, currentWallet, setCurrentWallet } = options
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

    setCurrentWallet?.(wallets[0])

    // 格式化数据成九宫格
    const gridWalletList = wallets
      .filter((w) =>
        w.tokens?.some(
          (t) => t.value_usd > 0 && t.address === selectFromToken?.address
        )
      )
      .reduce<PartialWalletRes[][]>((cur, next) => {
        if (count % 3 == 0) {
          cur.push([next])
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
      (defaultWallet.id !== currentWallet?.id ||
        defaultWallet.chain?.id != currentWallet?.chain?.id)
    ) {
      setGridWalletList(gridWalletList)

      if (defaultWallet?.chain?.id !== currentWallet?.chain?.id) {
        setCurrentWallet?.(defaultWallet)
      }
    }
  }

  useEffect(() => {
    if (selectFromToken) {
      handleWallet()
    }
  }, [walletList, selectFromToken])

  return {
    currentWallet,
    gridWalletList,
    selectFromToken,
    setCurrentWallet,
    findTokenUsd,
  }
}
