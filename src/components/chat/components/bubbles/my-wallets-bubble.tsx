import React, { useState } from 'react'
import { IoMdWallet } from 'react-icons/io'
import {
  Avatar,
  Button,
  CircularProgress,
  ClickAwayListener,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'

import MessageBubble from './message-bubble'
import { utilFmt } from '@/utils/format'

import type {
  ChatResponseAnswerMeta,
  ChatResponseWalletListToken,
} from '@/api/chat/types'
import { formatUnits } from 'viem'
import numeral from 'numeral'
import { useQuery } from '@tanstack/react-query'
import { walletApi } from '@/api/wallet'
import { WalletPlatform } from '@/api/wallet/params'
import { useChat } from '@/hooks/use-chat'

interface Props extends React.ComponentProps<'div'> {
  meta?: ChatResponseAnswerMeta
}

const MyWalletsBubble = (props: Props) => {
  // const { meta } = props
  // const wallets = meta?.data ?? []
  const { sendMsg, addMessageAndLoading } = useChat()

  const { data: result, isLoading } = useQuery({
    queryKey: [walletApi.getWallets.name],
    queryFn: () => walletApi.getWallets({ platform: WalletPlatform.SOL }),
    refetchInterval: 15_000,
  })

  const wallets = result?.data || []

  console.log(wallets)

  const { t } = useTranslation()

  const onDetails = (token: ChatResponseWalletListToken) => {
    console.log('onDetails click', token)
    toast('Coming soon...')
  }

  const onBuy = (token: ChatResponseWalletListToken) => {
    const question = t('intent.buy')
      .replace('$1', token.name)
      .replace('$2', token.address)

    addMessageAndLoading({ msg: question, position: 'right' })
    sendMsg({
      question: question,
    })
  }

  const onSell = (token: ChatResponseWalletListToken) => {
    console.log('onSell click', token)
    toast('Coming soon...')
  }

  if (isLoading) {
    return (
      <MessageBubble>
        <div className="flex items-center">
          <CircularProgress size={35}></CircularProgress>
        </div>
      </MessageBubble>
    )
  }

  return (
    <MessageBubble>
      {wallets.map((w, i) => (
        <React.Fragment key={w.id}>
          <div className="flex items-center mb-2">
            <IoMdWallet size={28} className="text-primary" />
            <div className="ml-2 font-bold text-lg">
              {w.name} · ${numeral(w.value).format('0,0.00')}
            </div>
          </div>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell classes={{ root: '!pl-0 !text-gray-400' }}>
                  {t('asset')}
                </TableCell>
                <TableCell classes={{ root: '!text-gray-400' }}>
                  {t('value')}
                </TableCell>
                <TableCell classes={{ root: '!text-gray-400' }}>
                  {t('balance')}
                </TableCell>
                <TableCell classes={{ root: '!text-gray-400' }}>
                  {t('price').toUpperCase()}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {w.tokens
                .sort((a, b) => Number(b.valueUsd) - Number(a.valueUsd))
                .map((t, i) => (
                  <Tokens
                    key={i}
                    token={t}
                    showBorder={i !== w.tokens.length - 1}
                    onDetails={onDetails}
                    onBuy={onBuy}
                    onSell={onSell}
                  />
                ))}
            </TableBody>
          </Table>
          {wallets.length - 1 !== i && (
            <Divider classes={{ root: '!border-gray-300 !mt-3 !mb-4' }} />
          )}
        </React.Fragment>
      ))}
    </MessageBubble>
  )
}

interface TokensProps {
  token: ChatResponseWalletListToken
  showBorder?: boolean
  onDetails?: (row: ChatResponseWalletListToken) => void
  onBuy?: (row: ChatResponseWalletListToken) => void
  onSell?: (row: ChatResponseWalletListToken) => void
}

const Tokens = (props: TokensProps) => {
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

export default MyWalletsBubble
