import { use, useContext, useEffect, useState } from 'react'
import { WalletCardProps } from '@/stores/use-wallet-store'
import { SwapContext } from './context'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

export const useSwapWallet = () => {
  const { t } = useTranslation()

  const { checkedWallet, selectFromToken } = useContext(SwapContext)
  const [currentWallet, setCurrentWallet] = useState<
    WalletCardProps | undefined
  >()
  const [gridWalletList, setGridWalletList] = useState<WalletCardProps[][]>([])

  const findTokenUsd = (wallet: WalletCardProps) => {
    const token = wallet.tokens?.find(
      (t) => t.address == selectFromToken?.address
    )
    return token?.value_usd ?? 0
  }

  const handleWallet = (checkedWallet: WalletCardProps[]) => {
    let count = 0
    const gridWalletList = checkedWallet
      // 筛选出和FromToken同一条链的钱包
      .filter((w) => w?.chain?.id == selectFromToken?.chain?.id)
      // 按照余额最高的往下排
      .sort((a, b) => findTokenUsd(a) - findTokenUsd(b))
      // 格式化数据成九宫格
      .reduce<WalletCardProps[][]>((cur, next) => {
        if (count % 3 == 0) {
          cur.push([])
        }
        cur[cur.length - 1].push(next)
        count++
        return cur
      }, [])

    if (gridWalletList?.[0]?.[0]) {
      setGridWalletList(gridWalletList)
      setCurrentWallet(gridWalletList?.[0][0])
    } else {
      toast.error(t('no.wallets.available'))
    }
  }

  useEffect(() => {
    if (checkedWallet?.length) {
      handleWallet(checkedWallet)
    }
  }, [checkedWallet, currentWallet, selectFromToken])

  return {
    currentWallet,
    walletList: checkedWallet,
    gridWalletList,
    selectFromToken,
    setCurrentWallet,
    findTokenUsd,
  }
}
