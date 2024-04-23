import { ChatResponseTxConfrim, TokenInfo } from '@/api/chat/types'
import { DialogHeader } from '@/components/dialog-header'
import { useShow } from '@/hooks/use-show'
import { Dialog, Menu, MenuItem, OutlinedInput } from '@mui/material'
import clsx from 'clsx'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IoIosArrowDown } from 'react-icons/io'
import { IoScanCircle, IoSearchCircle, IoSearchOutline } from 'react-icons/io5'
import { SelectTokenDialog } from './select-token-dialog'

interface Props {
  tokenList?: TokenInfo[]
  selectToken?: TokenInfo
  isBuy: boolean
  isFrom: boolean
  isFinalTx: boolean
  data: ChatResponseTxConfrim
  switchToken: (token: TokenInfo) => void
}

export const SelectToken: React.FC<Props> = ({
  switchToken,
  tokenList,
  isBuy,
  selectToken,
  data,
  isFrom,
  isFinalTx,
}: Props) => {
  const { t } = useTranslation()
  const { show, open, hidden } = useShow(false)

  const handleClick = (token: TokenInfo) => {
    switchToken(token)
    hidden()
  }

  const onSwitch = (event: any) => {
    open()
  }
  if (isFrom) {
    return (
      <>
        <div
          className={clsx(
            'h-full cursor-pointer leading-none py-[12px] text-sm border-l-2 text-nowrap pl-3',
            isBuy && 'flex items-center cursor-pointer',
            isFinalTx && 'pointer-events-none'
          )}
          onClick={onSwitch}
        >
          <img
            src={selectToken?.chain_logo}
            alt="chain-slogo"
            width={18}
            height={18}
            className="w-[18px] h-[18px] mr-1"
          ></img>
          {`${selectToken?.token_name}`}
          <IoIosArrowDown className="ml-1 w-[34px]"></IoIosArrowDown>
        </div>
        {isBuy ? (
          <SelectTokenDialog show={show} open={open} hidden={hidden} />
        ) : null}
      </>
    )
  }

  const toToken = data.to_token_info.find(
    (t) => t == selectToken
  )

  return (
    <>
      <div
        className={clsx(
          'border rounded-xl py-[10px] px-6 text-sm',
          !isBuy && 'flex items-center cursor-pointer',
          isFinalTx && 'pointer-events-none'
        )}
        onClick={onSwitch}
      >
        {isBuy ? (
          data.to_token_name?.toUpperCase()
        ) : (
          <>
            <img
              src={toToken?.chain_logo}
              width={22}
              height={22}
              className="w-[20px] h-[20px] mr-1"
            />
            {toToken?.token_name}
            <IoIosArrowDown className="ml-1"></IoIosArrowDown>
          </>
        )}
      </div>
      {!isBuy ? (
        <SelectTokenDialog show={show} open={open} hidden={hidden} />
      ) : null}
    </>
  )
}
