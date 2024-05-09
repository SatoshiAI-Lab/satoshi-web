import PercentTag from '@/components/percent-tag'

import { clsx } from 'clsx'
import { Avatar, Menu, MenuItem, Toolbar, Tooltip } from '@mui/material'
import { useContext, useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'
import { defaultImg } from '@/config/imageUrl'
import { utilFmt } from '@/utils/format'
import { SwapContext } from '@/hooks/use-swap/use-swap-provider'

import type { MultiChainCoin } from '@/api/chat/types'
import { useShow } from '@/hooks/use-show'
import { DialogSelectToken } from './dialog-select-token/dialog-select-token'
import { useTranslation } from 'react-i18next'

interface Props {
  isFrom: boolean
  isFinalTx: boolean
}

export const SelectToken: React.FC<Props> = ({ isFrom, isFinalTx }: Props) => {
  const { t } = useTranslation()
  const {
    show: showDialog,
    open: openDialog,
    hidden: hiddenDialog,
  } = useShow(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const {
    fromTokenList,
    setSelectFromToken,
    setSelectToToken,
    selectFromToken,
    selectToToken,
    toTokenList,
  } = useContext(SwapContext)

  const switchToken = isFrom ? setSelectFromToken : setSelectToToken
  const tokenList = isFrom ? fromTokenList : toTokenList
  const selectToken = isFrom ? selectFromToken : selectToToken

  const handleClick = (token: MultiChainCoin) => {
    switchToken(token)
    onCloseMenu()
  }

  const openMenu = (event: any) => {
    if (toTokenList && toTokenList?.length > 1) {
      setAnchorEl(event.currentTarget)
    } else {
      openDialog()
    }
  }

  const onSwitch = () => {
    openDialog()
  }

  const onCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleOpenDialog = () => {
    openDialog()
    onCloseMenu()
  }

  const tokenMenu = () => {
    return (
      <>
        <Menu
          anchorEl={anchorEl}
          open={!!anchorEl}
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
                <div className="flex items-center py-1">
                  <div className="mr-2 self-center ">
                    <Avatar src={item.logo} sizes="30">
                      {item.symbol?.slice(0, 1).toUpperCase()}
                    </Avatar>
                  </div>
                  <div className="flex">
                    <div className="min-w-[60px]">
                      <div>{`${item.symbol}`}</div>
                      <div className="text-xs text-gray-500">{`${item.chain.name}`}</div>
                    </div>
                    <div className="ml-3">
                      <div className="">
                        <div className="leading-none p-1rounded-lg">
                          <PercentTag
                            percent={item.price_change ?? 0}
                            className="text-sm"
                          />
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          ${utilFmt.token(item.price_usd)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </MenuItem>
            )
          })}
          <MenuItem onClick={handleOpenDialog}>{t('select.token')}</MenuItem>
        </Menu>
        <DialogSelectToken
          show={showDialog}
          open={openDialog}
          hidden={hiddenDialog}
          isFrom={isFrom}
        ></DialogSelectToken>
      </>
    )
  }

  if (isFrom) {
    return (
      <>
        <div
          className={clsx(
            'cursor-pointer leading-none py-[6px] text-sm border-l-2 text-nowrap pl-3 flex-shrink-0 h-[52px]',
            'flex items-center cursor-pointer',
            isFinalTx && 'pointer-events-none'
          )}
          onClick={onSwitch}
        >
          {selectToken ? (
            <img
              src={selectToken?.logo || defaultImg}
              alt="chain-slogo"
              width={35}
              height={35}
              className="w-[35px] h-[35px] mr-1 rounded-full"
            ></img>
          ) : (
            <span>{t('select.a.token')}</span>
          )}
          {selectToken && (
            <div className="mx-1">
              <div>{`${selectToken?.symbol}`}</div>
              <div className="text-xs text-gray-400">{`${selectToken?.chain.name}`}</div>
            </div>
          )}
          <IoIosArrowDown className="ml-1" size={20}></IoIosArrowDown>
        </div>
        {tokenMenu()}
      </>
    )
  }

  return (
    <>
      <div
        className={clsx(
          'h-[52px] border border-neutral-300 rounded-xl py-[6px] px-5 text-sm flex-shrink-0',
          'flex items-center cursor-pointer',
          isFinalTx && 'pointer-events-none'
        )}
        onClick={openMenu}
      >
        {selectToToken ? (
          <>
            <Avatar src={selectToToken?.logo} className="!w-[35px] !h-[35px]">
              {selectToToken?.symbol?.slice(0, 1).toUpperCase() ?? '-'}
            </Avatar>
            <div className="mx-2">
              <div className="max-w-[110px] truncate">
                {selectToToken?.symbol}
              </div>
              <div className="text-xs text-gray-400">
                {selectToToken?.chain.name}
              </div>
            </div>
          </>
        ) : (
          <span>{t('select.a.token')}</span>
        )}
        <IoIosArrowDown className="ml-1" size={20}></IoIosArrowDown>
      </div>
      {tokenMenu()}
    </>
  )
}
