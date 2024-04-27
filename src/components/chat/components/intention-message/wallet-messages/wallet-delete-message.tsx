import React, { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'

import type { UserCreateWalletResp } from '@/api/wallet/params'

import { useMessagesContext } from '@/contexts/messages'
import { MetaType } from '@/api/chat/types'
import { walletApi } from '@/api/wallet'
import { MessageBubble } from '../../message-bubble'
import { LoadingMessage } from '../../loading-message'
import {
  WalletSelectMessage,
  type WalletSelectMessageExport,
} from '../../wallet-select-message'
import { WalletCardProps, useWalletStore } from '@/stores/use-wallet-store'

export const WaleltDeleteMessage = () => {
  const { t } = useTranslation()
  const { getMetaData } = useMessagesContext()
  const { findWallet } = useWalletStore()
  const { wallet_name } = getMetaData<MetaType.WalletDelete>()
  const [isClicked, setIsClicked] = useState(false)
  const walletSelectRef = useRef<WalletSelectMessageExport | null>(null)

  const { isPending, isError, isSuccess, mutateAsync } = useMutation({
    mutationKey: [walletApi.deleteWallet.name],
    mutationFn: walletApi.deleteWallet,
  })
  const wallet = !isEmpty(wallet_name) && findWallet(wallet_name)

  const onDelete = async (w: UserCreateWalletResp | WalletCardProps) => {
    Promise.all([
      mutateAsync({ wallet_id: w.id ?? '' }),
      walletSelectRef.current?.refetch(),
    ]).finally(() => setIsClicked(true))
  }

  useEffect(() => {
    if (isEmpty(wallet_name) || !wallet) return
    onDelete(wallet)
  }, [])

  // Deleting.
  if (isPending) {
    return <MessageBubble children={t('wallet.deleting')} />
  }

  // Delete error.
  if (isError) {
    return <MessageBubble children={t('walelt.delete.failed')} />
  }

  // Delete success.
  if (isSuccess && isClicked) {
    return (
      <MessageBubble>
        {t('wallet')} <span className="font-bold">{wallet_name}</span>{' '}
        {t('delete-success').toLowerCase()}
      </MessageBubble>
    )
  }

  // Not found wallet.
  if (!wallet && !isClicked) {
    return (
      <MessageBubble>
        <p>{t('wallet.not-found')}:</p>
        <p className="font-bold">{wallet_name}</p>
      </MessageBubble>
    )
  }

  // `wallet_name` is empty, select wallet.
  if (isEmpty(wallet_name)) {
    return (
      <WalletSelectMessage
        ref={walletSelectRef}
        title={t('wallet.delete.title')}
        disabled={isPending || isClicked}
        onWalletClick={onDelete}
      />
    )
  }

  // Ask user to wait.
  return <LoadingMessage children={t('waiting-moment')} />
}

export default WaleltDeleteMessage
