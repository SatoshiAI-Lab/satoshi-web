import React, { useEffect, useState } from 'react'
import { IoMdWallet } from 'react-icons/io'
import {
  CircularProgress,
  Collapse,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import numeral from 'numeral'
import { useQuery } from '@tanstack/react-query'
import { IoIosArrowDown } from 'react-icons/io'
import clsx from 'clsx'

import { walletApi } from '@/api/wallet'
import { WalletPlatform } from '@/api/wallet/params'
import { useChat } from '@/hooks/use-chat'
import TokenRow from './token-row'
import MessageBubble from '../message-bubble'
import { utilArr } from '@/utils/array'

import type {
  ChatResponseAnswerMeta,
  ChatResponseWalletListToken,
} from '@/api/chat/types'

interface Props extends React.ComponentProps<'div'> {
  meta?: ChatResponseAnswerMeta
}

const MyWalletsBubble = (props: Props) => {
  // const { meta } = props
  // const wallets = meta?.data ?? []
  const [folds, setFolds] = useState<string[]>([])
  const { sendMsg, addMessageAndLoading } = useChat()

  const { data: result, isLoading } = useQuery({
    queryKey: [walletApi.getWallets.name],
    queryFn: () => walletApi.getWallets({ platform: WalletPlatform.SOL }),
    refetchInterval: 15_000,
  })
  const wallets = result?.data || []

  const { t } = useTranslation()

  const sendQ = (question: string) => {
    addMessageAndLoading({ msg: question, position: 'right' })
    sendMsg({
      question: question,
    })
  }

  const onDetails = (token: ChatResponseWalletListToken) => {
    const question = t('intent.detail').replace('$1', token.address)
    sendQ(question)
  }

  const onBuy = (token: ChatResponseWalletListToken) => {
    const question = t('intent.buy')
      .replace('$1', token.name)
      .replace('$2', token.address)

    sendQ(question)
  }

  const onSell = (token: ChatResponseWalletListToken) => {
    const question = t('intent.sell')
      .replace('$1', token.name)
      .replace('$2', token.address)

    addMessageAndLoading({ msg: question, position: 'right' })
    sendMsg({
      question: question,
    })
  }

  const onFold = (wallet: (typeof wallets)[number]) => {
    if (folds.includes(wallet.id)) {
      setFolds(utilArr.remove(folds, wallet.id))
    } else {
      setFolds([...folds, wallet.id])
    }
  }

  useEffect(() => {
    // If number of wallets >= 3, folded except the first one
    if (wallets.length >= 3) {
      const excludeFirst = wallets.filter((_, i) => i === 0)
      setFolds(excludeFirst.map((w) => w.id))
    }
  }, [])

  if (isLoading) {
    return (
      <MessageBubble>
        <div className="flex items-center">
          <CircularProgress size={35} />
        </div>
      </MessageBubble>
    )
  }

  const TableHeader = () => (
    <TableHead>
      <TableRow>
        <TableCell classes={{ root: '!pl-0 !text-gray-400' }}>
          {t('asset')}
        </TableCell>
        <TableCell classes={{ root: '!text-gray-400' }}>{t('value')}</TableCell>
        <TableCell classes={{ root: '!text-gray-400' }}>
          {t('balance')}
        </TableCell>
        <TableCell classes={{ root: '!text-gray-400' }}>
          {t('price').toUpperCase()}
        </TableCell>
      </TableRow>
    </TableHead>
  )

  return (
    <MessageBubble>
      {wallets.map((w, i) => (
        <React.Fragment key={w.id}>
          <div
            className="flex items-center mb-2 cursor-pointer"
            onClick={() => onFold(w)}
          >
            <IoMdWallet size={28} className="text-primary" />
            <div className="ml-2 font-bold text-lg">
              {w.name} · ${numeral(w.value).format('0,0.00')}
            </div>
            <IoIosArrowDown
              size={20}
              className={clsx(
                'transition-all duration-300 cursor-pointer ml-2',
                folds.includes(w.id) ? 'rotate-180' : ''
              )}
            />
          </div>
          <Collapse in={folds.includes(w.id)}>
            <Table size="small">
              <TableHeader />
              <TableBody>
                {w.tokens
                  .sort((a, b) => Number(b.valueUsd) - Number(a.valueUsd))
                  .map((t, i) => (
                    <TokenRow
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
          </Collapse>
        </React.Fragment>
      ))}
    </MessageBubble>
  )
}

export default MyWalletsBubble
