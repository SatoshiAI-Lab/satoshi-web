import {
  ChatResponseTxConfrim,
  ChatResponseWalletListToken,
  TokenInfo,
} from '@/api/chat/types'
import { useWalletStore, WalletCardProps } from '@/stores/use-wallet-store'
import { useEffect, useState } from 'react'

interface Options {
  isBuy: boolean
  data: ChatResponseTxConfrim
}

export const useTxToken = ({ isBuy, data }: Options) => {
  const { currentWallet, allWallets } = useWalletStore()

  let tokenList = data.from_token_info

  let checkedWalletList: WalletCardProps[] = []

  tokenList = tokenList.filter((token) => {
    for (let i = 0; i < allWallets.length; i++) {
      const wallet = allWallets[i]
      if (wallet.platform !== token.platform) {
        continue
      }

      const result = wallet.tokens?.some((item) => {
        return (
          item.chain_name == token.chain &&
          item.symbol == token.token_name &&
          item.valueUsd > 0
        )
      })

      if (result) {
        checkedWalletList.push(wallet)
        return result
      }
    }
    return false
  })

  const [selectToken, setSelectToken] = useState<TokenInfo | undefined>(
    tokenList[0]
  )

  const sortedCheckedWalletList = checkedWalletList
    // Filter the wallet of the chain corresponding to the token
    .filter((w) => w.chain?.name == selectToken?.chain)
    // Filter wallets in descending order of balance size
    ?.sort((a, b) => {
      const x = new Date(b.added_at!).getTime()
      const y = new Date(a.added_at!).getTime()
      return x - y
    })

  const [selectWallet, setSelectWallet] = useState<WalletCardProps>(
    sortedCheckedWalletList[0]
  )

  const checkToken = (token: ChatResponseWalletListToken) => {
    // TODO: Checked
    // if (token.amount <= 0) {
    //   return false
    // }

    return (
      data.from_token_info.findIndex((item) => {
        return item.token_name == token.symbol && item.chain == token.chain_name
      }) != -1
    )
  }

  let count = 0
  const walletList = sortedCheckedWalletList.reduce<WalletCardProps[][]>(
    (cur, next) => {
      if (count % 3 == 0) {
        cur.push([])
      }
      cur[cur.length - 1].push(next)
      count++
      return cur
    },
    []
  )

  useEffect(() => {
    setSelectWallet(sortedCheckedWalletList[0])
  }, [selectToken])

  return {
    walletList,
    currentWallet,
    sortedCheckedWalletList,
    selectToken,
    tokenList,
    checkedWalletList,
    selectWallet,
    setSelectWallet,
    open,
    checkToken,
    setSelectToken,
  }
}
