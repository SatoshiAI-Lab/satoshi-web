import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

import { useMessagesContext } from '@/contexts/messages'
import { MetaType } from '@/api/chat/types'
import { LoadingMessage } from '../../loading-message'
import { MessageBubble } from '../../message-bubble'
import { useWalletStore } from '@/stores/use-wallet-store'
import { walletApi } from '@/api/wallet'
import { WalletSelectMessage } from '../../wallet-select-message'
import { useWalletList } from '@/hooks/use-wallet-list'
import { ChatCase } from '../../chat-case'
import { ResponseCode } from '@/api/fetcher/types'

export const WalletChangeMessage = () => {
  const { t } = useTranslation()
  const { findWallet } = useWalletStore()
  const { getMetaData } = useMessagesContext()
  const { from_wallet_name, to_wallet_name } =
    getMetaData<MetaType.WalletChange>()
  const allIsEmpty = isEmpty(from_wallet_name) && isEmpty(to_wallet_name)
  const wallet = findWallet(from_wallet_name)
  const { getAllWallet } = useWalletList()

  const { data, isPending, isError, isSuccess, mutateAsync } = useMutation({
    mutationKey: [walletApi.renameWallet.name],
    mutationFn: walletApi.renameWallet,
    onError: (e) => toast.error(e.message),
  })
  const { code } = data ?? {}
  const isErr = isError || (code && code !== ResponseCode.Success)

  const onRename = (wallet_id: string) => {
    if (!wallet_id) return

    mutateAsync({
      wallet_id,
      name: to_wallet_name,
    }).finally(getAllWallet)
  }

  useEffect(() => {
    if (wallet) {
      onRename(wallet.id ?? '')
    }
  }, [])

  // Renaming.
  if (isPending) {
    return <LoadingMessage children={t('wallet.renaming')} />
  }

  // Rename error.
  if (isErr) {
    return <MessageBubble>{t('wallet.rename.error')}</MessageBubble>
  }

  // Rename success.
  if (isSuccess && data) {
    return (
      <MessageBubble>
        <p>{t('wallet.rename.success')}</p>
        <p>
          {t('wallet.rename.message')
            .replace('{}', from_wallet_name)
            .replace('{}', to_wallet_name)}
        </p>
      </MessageBubble>
    )
  }

  // `from` & `to` name is empty
  if (allIsEmpty) {
    return (
      <MessageBubble>
        <p>{t('wallet.change-name.title')}</p>
        <ChatCase text={t('wallet.change-name.example')} />
      </MessageBubble>
    )
  }

  // Only `from` name is empty.
  if (isEmpty(from_wallet_name)) {
    return <WalletSelectMessage onWalletClick={(w) => onRename(w.id)} />
  }

  // Wallet not found.
  if (!wallet) {
    return (
      <MessageBubble>
        {t('wallet.not-found')}: {from_wallet_name}
      </MessageBubble>
    )
  }

  // By default, waiting.
  return <LoadingMessage children={t('waiting-moment')} />
}

export default WalletChangeMessage
