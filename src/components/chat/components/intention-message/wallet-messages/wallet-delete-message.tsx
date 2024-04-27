import React, { memo, useEffect, useRef, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'
import { Button } from '@mui/material'
import { toast } from 'react-hot-toast'
import { nanoid } from 'nanoid'

import type { UserCreateWalletResp } from '@/api/wallet/params'

import { useMessagesContext } from '@/contexts/messages'
import { MetaType } from '@/api/chat/types'
import { walletApi } from '@/api/wallet'
import { MessageBubble } from '../../message-bubble'
import { utilFmt } from '@/utils/format'
import { Chain, WALLET_CONFIG } from '@/config/wallet'
import { ChainSelect } from '@/components/chain-select'
import { LoadingMessage } from '../../loading-message'

export const WaleltDeleteMessage = memo(() => {
  const { t } = useTranslation()
  const { getMetaData } = useMessagesContext()
  const { wallet_name } = getMetaData<MetaType.WalletDelete>()
  const [chain, setChain] = useState(WALLET_CONFIG.defaultChain)
  const [isClicked, setIsClicked] = useState(false)
  const idRef = useRef('')

  const { data, isRefetching, refetch } = useQuery({
    queryKey: [walletApi.getWallets.name + idRef.current, chain],
    queryFn: () => walletApi.getWallets(chain),
  })
  const wallets = data?.data[chain] ?? []

  const { isPending, isSuccess, mutateAsync } = useMutation({
    mutationKey: [walletApi.deleteWallet.name],
    mutationFn: walletApi.deleteWallet,
    onError() {
      toast.error(t('wallet.delete.failed'))
      setTimeout(() => setIsClicked(false), 500)
    },
    onSuccess: () => toast.success(t('wallet.delete.success')),
  })
  const disabled = isPending || isRefetching || isClicked
  const targetWallet =
    !isEmpty(wallet_name) && wallets.find((w) => w.name === wallet_name)

  const onDelete = async (w: UserCreateWalletResp) => {
    const id = toast.loading(t('wallet.deleting'))
    try {
      await mutateAsync({ wallet_id: w.id })
      await refetch()
    } catch (error) {
    } finally {
      setIsClicked(true)
      toast.dismiss(id)
    }
  }

  useEffect(() => {
    idRef.current = nanoid()
    if (isEmpty(wallet_name) || !targetWallet) return
    onDelete(targetWallet)
  }, [])

  // Delete success.
  if (isSuccess && disabled) {
    return (
      <MessageBubble>
        {t('wallet')} <span className="font-bold">{wallet_name}</span>{' '}
        {t('delete-success').toLowerCase()}
      </MessageBubble>
    )
  }

  // Not found wallet.
  if (!targetWallet && !disabled) {
    return (
      <MessageBubble>
        <p>{t('wallet.not-found')}:</p>
        <p className="font-bold">{wallet_name}</p>
      </MessageBubble>
    )
  }

  // Auto delete.
  if (targetWallet && !disabled) {
    return <LoadingMessage>{t('wallet.deleting')}</LoadingMessage>
  }

  // `wallet_name` is empty, select wallet.
  if (isEmpty(wallet_name)) {
    return (
      <MessageBubble>
        <p>{t('wallet.delete.title')}</p>
        <ChainSelect
          value={chain}
          onSelect={(c) => setChain(c as Chain)}
          avatarSize={18}
          classes={{ select: '!flex !items-center !py-2 !text-sm' }}
          disabled={disabled}
        />
        <ul className="flex flex-col">
          {wallets.map((w) => (
            <li key={w.id} className="mt-2 last:mb-1">
              <Button
                variant="outlined"
                size="small"
                className="!flex-col !w-full !items-start"
                disabled={disabled}
                onClick={() => onDelete(w)}
              >
                <span>
                  {t('name')}: {w.name}
                </span>
                <span>
                  {t('address')}: {utilFmt.addr(w.address)}
                </span>
              </Button>
            </li>
          ))}
        </ul>
      </MessageBubble>
    )
  }

  // Ask user to wait.
  return <LoadingMessage children={t('waiting-moment')} />
})

export default WaleltDeleteMessage
