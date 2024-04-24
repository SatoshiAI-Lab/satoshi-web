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
  const { currentWallet, allWalletList } = useWalletStore()

  let fromTokenList = data.from_token_info
  let toTokenList = data.to_token_info

  let checkedWalletList: WalletCardProps[] = []
  fromTokenList = fromTokenList.filter((token) => {
    for (let i = 0; i < allWalletList.length; i++) {
      const wallet = allWalletList[i]

      if (wallet.chain?.name !== token.chain_name) {
        continue
      }

      const result = wallet.tokens?.some((item) => {
        return (
          item.chain_name == token.chain_name &&
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

  const selectFirstFromToken = fromTokenList[0]

  toTokenList = toTokenList.filter((token) => {
    for (let i = 0; i < allWalletList.length; i++) {
      const wallet = allWalletList[i]
      // if (wallet.platform !== token.platform) {
      //   continue
      // }

      // const result = wallet.tokens?.some((item) => {
      //   return (
      //     item.chain_name == token.chain_name && item.symbol == token.token_name
      //   )
      // })

      // if (result) {
      //   checkedWalletList.push(wallet)
      //   return result
      // }
    }
    return false
  })

  const selectFirstToToken = toTokenList[0]

  const [selectFromToken, setSelectFromToken] = useState<TokenInfo | undefined>(
    selectFirstFromToken
  )

  const [selectToToken, setSelectToToken] = useState<TokenInfo | undefined>(
    selectFirstToToken
  )

  const sortedCheckedWalletList = checkedWalletList
    // Filter the wallet of the chain corresponding to the token
    .filter((w) => w.chain?.name == selectFromToken?.chain_name)
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
        return (
          item.token_name == token.symbol && item.chain_name == token.chain_name
        )
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
  }, [selectFromToken])

  return {
    walletList,
    currentWallet,
    sortedCheckedWalletList,
    selectFromToken,
    selectToToken,
    fromTokenList,
    toTokenList,
    checkedWalletList,
    selectWallet,
    setSelectWallet,
    open,
    checkToken,
    setSelectFromToken,
    setSelectToToken,
  }
}
