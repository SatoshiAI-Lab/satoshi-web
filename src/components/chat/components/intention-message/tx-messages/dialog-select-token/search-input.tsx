import { ChatResponseWalletListToken, MultiChainCoin } from '@/api/chat/types'
import { tokenApi } from '@/api/token'
import { SwapContext } from '@/hooks/use-swap/use-swap-provider'
import { OutlinedInput } from '@mui/material'
import { ChangeEvent, useContext, useRef, useState } from 'react'
import { IoSearchOutline, IoCloseOutline } from 'react-icons/io5'

interface Props {
  isFrom: boolean
  searchValue: string
  selectWalletTokens?: ChatResponseWalletListToken[]
  setSearchValue: (v: string) => void
  setIsNameSearch: (v: boolean) => void
  setSearchTokens: (v: MultiChainCoin[]) => void
  setLoadingSearch: (v: boolean) => void
}

export const SearchInput = ({
  isFrom,
  searchValue,
  selectWalletTokens,
  setSearchValue,
  setIsNameSearch,
  setSearchTokens,
  setLoadingSearch,
}: Props) => {
  const timer = useRef<NodeJS.Timeout>()

  const { selectFromToken, selectToToken, walletList } = useContext(SwapContext)

  const onSearch = async (value: string) => {
    try {
      let { data: tokens } = await tokenApi.multiCoin(value)

      const isNameSearch = tokens.some(
        (t) => t.symbol.toLowerCase() === value.toLowerCase()
      )

      tokens =
        selectWalletTokens?.map((token) => {
          for (const t of tokens) {
            if (
              token.address === t.address &&
              token.chain.id === t.chain.name
            ) {
              return {
                ...t,
                ...token,
              }
            }
          }
          return token
        }) || []

      // 一、搜索代币名字
      // 1. 优先选择原先的钱包
      // 2. 其他钱包也没有余额
      // 3. 还是选回原线原先钱包，并提示余额不足
      setIsNameSearch(isNameSearch)
      setSearchTokens(tokens)
    } catch (e) {
    } finally {
      setLoadingSearch(false)
    }
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    setSearchValue(value)
    clearTimeout(timer.current)

    if (!value.trim()) return

    setLoadingSearch(true)
    timer.current = setTimeout(() => {
      onSearch(value)
    }, 200)
  }

  return (
    <div className="px-6">
      <OutlinedInput
        placeholder="Search name or paste address"
        className="w-full pt-[5px] pb-2"
        classes={{ input: '!mb-[-4px]' }}
        size="small"
        value={searchValue}
        startAdornment={<IoSearchOutline size={25} className="mr-2" />}
        endAdornment={
          searchValue && (
            <IoCloseOutline
              size={25}
              className="cursor-pointer"
              onClick={() => setSearchValue('')}
            />
          )
        }
        onChange={onChange}
      ></OutlinedInput>
    </div>
  )
}
