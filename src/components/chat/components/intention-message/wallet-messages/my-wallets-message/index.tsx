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
import { clsx } from 'clsx'
import { useQuery } from '@tanstack/react-query'
import { isEmpty } from 'lodash'

import type { ChatResponseWalletListToken, MetaType } from '@/api/chat/types'
import type { WalletCardProps } from '@/components/wallet/types'
import type { UserCreateWalletResp } from '@/api/wallet/params'

import { TokenRow } from './token-row'
import { MessageBubble } from '../../../message-bubble'
import { CustomSuspense } from '@/components/custom-suspense'
import { utilArr } from '@/utils/array'
import { walletApi } from '@/api/wallet'
import { useChat } from '@/hooks/use-chat'
import { useMessagesContext } from '@/contexts/messages'
import { Chain, WALLET_CONFIG } from '@/config/wallet'
import { ChainSelect } from '@/components/chain-select'

const COLLAPSE_MAX = 3

export const MyWalletsMessage = () => {
  const { getMetaData } = useMessagesContext()
  const { chain_name } = getMetaData<MetaType.WalletCheck>()
  const [folds, setFolds] = useState<string[]>([])
  const [wallets, setWallets] = useState<UserCreateWalletResp[]>([])
  const { t } = useTranslation()
  const { sendChat } = useChat()
  const [chain, setChain] = useState(chain_name || WALLET_CONFIG.defaultChain)
  const chainNameIsEmpty = isEmpty(chain_name)

  const { data: walletData } = useQuery({
    queryKey: [walletApi.getWallets.name, chain],
    queryFn: () => walletApi.getWallets(chain),
  })

  const sendQ = (question: string) => {
    // addMessageAndLoading({ msg: question, position: 'right' })
    // sendMsg({ question })
    sendChat({ question })
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

    // addMessageAndLoading({ msg: question, position: 'right' })
    // sendMsg({ question: question })
    sendChat({ question })
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
    if (wallets.length >= COLLAPSE_MAX) {
      const excludeFirst = wallets.filter((_, i) => i === 0)
      setFolds(excludeFirst.map((w) => w.id!))
    }
  }, [])

  useEffect(() => {
    const walletList = walletData?.data[chain as Chain] ?? []

    // If length is same, don't to sort, optimize performance.
    if (utilArr.sameLen(walletList, wallets)) return

    // Sort by balance DESC.
    const sortedWalelts = walletList.sort(
      (a, b) => Number(b!.value)! - Number(a!.value)
    )
    setWallets(sortedWalelts)
  }, [walletData])

  const TableHeader = () => (
    <TableHead>
      <TableRow>
        <TableCell classes={{ root: '!pl-0 !text-gray-400' }}>
          {t('asset')}
        </TableCell>
        <TableCell classes={{ root: '!text-gray-400' }}>{t('value')}</TableCell>
        <TableCell classes={{ root: '!text-gray-400' }}>
          {t('balance').toUpperCase()}
        </TableCell>
        <TableCell classes={{ root: '!text-gray-400' }}>
          {t('price').toUpperCase()}
        </TableCell>
      </TableRow>
    </TableHead>
  )

  const NullToken = () => (
    <tr
      className={clsx(
        'text-gray-400 text-center w-full pt-2',
        'text-sm inline-block'
      )}
    >
      <td>{t('no-assets')}</td>
    </tr>
  )

  return (
    <MessageBubble>
      <div>{t('wallet.check.list')}</div>
      {chainNameIsEmpty && (
        <ChainSelect
          value={chain}
          onSelect={(c) => setChain(c as Chain)}
          avatarSize={18}
          classes={{ select: '!flex !items-center !py-1' }}
          className="my-2"
          showTitle={false}
        />
      )}
      {wallets.map((w, i) => (
        <React.Fragment key={w.id}>
          <div
            className="flex items-center mb-2 cursor-pointer"
            onClick={() => onFold(w)}
          >
            <IoMdWallet size={22} className="text-primary" />
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
          <Collapse
            // If less than MAX number, don't collapse.
            in={wallets.length >= COLLAPSE_MAX ? folds.includes(w.id!) : true}
          >
            <Table size="small">
              {TableHeader()}
              <TableBody>
                <CustomSuspense nullback={NullToken()}>
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

export default MyWalletsMessage
