import React, { useEffect, useState } from 'react'
import { IoMdWallet } from 'react-icons/io'
import {
  Collapse,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import numeral from 'numeral'
import { IoIosArrowDown } from 'react-icons/io'
import clsx from 'clsx'

import { useChat } from '@/hooks/use-chat'
import TokenRow from './token-row'
import MessageBubble from '../message-bubble'
import CustomSuspense from '@/components/custom-suspense'
import { utilArr } from '@/utils/array'
import { useWalletStore } from '@/stores/use-wallet-store'

import type { ChatResponseWalletListToken } from '@/api/chat/types'
import type { WalletCardProps } from '@/components/wallet/types'

const MyWalletsBubble = () => {
  const [folds, setFolds] = useState<string[]>([])
  const { t } = useTranslation()
  const { sendMsg, addMessageAndLoading } = useChat()
  const { wallets: data } = useWalletStore()
  const wallets =
    data.sort((a, b) => Number(b!.value)! - Number(a!.value)) || []

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
    sendMsg({ question: question })
  }

  const onFold = (wallet: Partial<WalletCardProps>) => {
    if (folds.includes(wallet?.id!)) {
      setFolds(utilArr.remove(folds, wallet.id!))
    } else {
      setFolds([...folds, wallet.id!])
    }
  }

  useEffect(() => {
    // If number of wallets >= 3, folded except the first one
    if (wallets.length >= 3) {
      const excludeFirst = wallets.filter((_, i) => i === 0)
      setFolds(excludeFirst.map((w) => w.id!))
    }
  }, [])

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
                folds.includes(w.id!) ? 'rotate-180' : ''
              )}
            />
          </div>
          <Collapse in={folds.includes(w.id!)}>
            <Table size="small">
              <TableHeader />
              <TableBody>
                <CustomSuspense
                  nullback={
                    <tr
                      className={clsx(
                        'text-gray-400 text-center w-full mt-2',
                        'text-sm'
                      )}
                    >
                      {t('no-assets')}
                    </tr>
                  }
                >
                  {w?.tokens
                    ?.sort((a, b) => Number(b.valueUsd) - Number(a.valueUsd))
                    .map((t, i) => (
                      <TokenRow
                        key={i}
                        token={t}
                        showBorder={i !== w!.tokens!.length - 1}
                        onDetails={onDetails}
                        onBuy={onBuy}
                        onSell={onSell}
                      />
                    ))}
                </CustomSuspense>
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
