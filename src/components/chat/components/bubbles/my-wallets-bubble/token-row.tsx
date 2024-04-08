import { useState } from 'react'
import {
  Avatar,
  Button,
  ClickAwayListener,
  TableCell,
  TableRow,
  Tooltip,
} from '@mui/material'
import clsx from 'clsx'
import numeral from 'numeral'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'

import { utilFmt } from '@/utils/format'

import type { ChatResponseWalletListToken } from '@/api/chat/types'

interface TokensProps {
  token: ChatResponseWalletListToken
  showBorder?: boolean
  onDetails?: (row: ChatResponseWalletListToken) => void
  onBuy?: (row: ChatResponseWalletListToken) => void
  onSell?: (row: ChatResponseWalletListToken) => void
}

export const TokenRow = (props: TokensProps) => {
  const { token, showBorder = true, onDetails, onBuy, onSell } = props
  const [selectAddr, setSelectId] = useState('')
  const { t } = useTranslation()

  const cellCls = (...inputs: Parameters<typeof clsx>) => {
    return clsx(
      // '!text-base',
      !showBorder && '!border-b-transparent',
      ...inputs
    )
  }

  return (
    <ClickAwayListener
      onClickAway={() => {
        if (token.address !== selectAddr) return
        setSelectId('')
      }}
    >
      <Tooltip
        title={
          <div className="flex">
            <Button size="small" onClick={() => onDetails?.(token)}>
              {t('details')}
            </Button>
            <Button
              size="small"
              classes={{ root: '!mx-2' }}
              onClick={() => onBuy?.(token)}
            >
              {t('buy')}
            </Button>
            <Button size="small" onClick={() => onSell?.(token)}>
              {t('sell')}
            </Button>
          </div>
        }
        classes={{
          tooltip: '!bg-white !border border-gray-300 !mt-0',
          arrow: clsx(
            'before:!bg-white before:!border before:border-gray-300',
            '!translate-x-5'
          ),
        }}
        arrow
        placement="bottom-start"
        PopperProps={{ disablePortal: true }}
        open={selectAddr === token.address}
        onClose={() => setSelectId('')}
        disableFocusListener
        disableHoverListener
        disableTouchListener
      >
        <TableRow
          classes={{
            root: clsx(
              '!cursor-pointer !min-h-[61px]',
              selectAddr === token.address && '!bg-gray-100'
            ),
          }}
          onClick={() => setSelectId(token.address)}
        >
          <TableCell classes={{ root: cellCls('!pl-0') }}>
            <div className="flex items-stretch ">
              <Avatar
                src={token.logoUrl}
                sx={{ width: 45, height: 45, bgcolor: 'black' }}
              >
                <div className="text-base">{token.name ?? 'Null'}</div>
              </Avatar>
              <div className="flex flex-col justify-between ml-2">
                <span className="text-primary">{token.name ?? 'null'}</span>
                <div className="flex items-center">
                  {/* TODO: should be chain logo & name */}
                  <Avatar
                    src={token.chain_logo}
                    sx={{ width: 20, height: 20 }}
                  />
                  <span className="text-gray-500 ml-1">{token.chain_name}</span>
                </div>
              </div>
            </div>
          </TableCell>
          <TableCell classes={{ root: cellCls() }}>
            ${Number(numeral(token.valueUsd).format('0.00'))}
          </TableCell>
          <TableCell classes={{ root: cellCls() }}>
            {numeral(formatUnits(BigInt(token.amount), token.decimals)).format(
              '0a.00'
            )}
          </TableCell>
          <TableCell classes={{ root: cellCls() }}>
            $
            {Number(
              numeral(utilFmt.token(Number(token.priceUsd))).format('0.00')
            )}
          </TableCell>
        </TableRow>
      </Tooltip>
    </ClickAwayListener>
  )
}

export default TokenRow
