import { Menu, MenuItem } from '@mui/material'
import { clsx } from 'clsx'
import { useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'

import type { ChatResponseTxConfrim, TokenInfo } from '@/api/chat/types'

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  // console.log(open)
  // console.log('isFinalTx', isFinalTx)

  const handleClick = (token: TokenInfo) => {
    switchToken(token)
    onCloseMenu()
  }

  const onSwitch = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const onCloseMenu = () => {
    setAnchorEl(null)
  }

  const TokenMenu = () => (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onCloseMenu}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
    >
      {tokenList?.map((item, i) => {
        return (
          <MenuItem
            key={i}
            onClick={() => handleClick(item)}
            selected={selectToken?.chain == item.chain}
          >
            <div className="flex items-center">
              <div className="mr-2 self-center">
                <img
                  src={item.chain_logo}
                  alt="chain-logo"
                  width={22}
                  height={22}
                  className="w-[22px] h-[22px]"
                ></img>
              </div>
              {`${item.chain_symbol}_${item.token_name}`}
            </div>
          </MenuItem>
        )
      })}
    </Menu>
  )

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
        {isBuy ? <TokenMenu></TokenMenu> : null}
      </>
    )
  }

  const toToken = data.to_token_info.find(
    (t) => t.platform_id == selectToken?.platform_id
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
      {!isBuy ? <TokenMenu></TokenMenu> : null}
    </>
  )
}
