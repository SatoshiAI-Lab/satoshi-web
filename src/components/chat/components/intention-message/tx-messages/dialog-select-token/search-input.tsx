import { ChatResponseWalletListToken, MultiChainCoin } from '@/api/chat/types'
import { tokenApi } from '@/api/token'
import { DialogContext } from '@/hooks/use-swap/use-dialog-select-token'
import { SwapContext } from '@/hooks/use-swap/use-swap-provider'
import { OutlinedInput } from '@mui/material'
import { ChangeEvent, useContext, useRef, useState } from 'react'
import { IoSearchOutline, IoCloseOutline } from 'react-icons/io5'

interface Props {
  isFrom: boolean
}

export const SearchInput = ({ isFrom }: Props) => {
  const timer = useRef<NodeJS.Timeout>()
  const { selectFromToken, selectToToken, walletList } = useContext(SwapContext)
  const {
    searchValue,
    setSearchValue,
    setIsNameSearch,
    setSearchTokens,
    setLoadingSearch,
    setSelectChainId,
    selectWallet,
  } = useContext(DialogContext)

  const onSearch = async (value: string) => {
    try {
      const { data } = await tokenApi.multiCoin(value)

      const isNameSearch = data.some(
        (t) => t.symbol.toLowerCase() === value.toLowerCase()
      )

      data.sort((a, b) => b.holders - a.holders)

      setIsNameSearch(isNameSearch)
      setSearchTokens(data)
      setSelectChainId('-1')
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
    }, 500)
  }

  const clearValue = () => {
    setSearchValue('')
    setSelectChainId('-1')
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
              onClick={clearValue}
            />
          )
        }
        onChange={onChange}
      ></OutlinedInput>
    </div>
  )
}