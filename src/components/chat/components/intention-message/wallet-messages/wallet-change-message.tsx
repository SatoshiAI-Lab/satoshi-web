import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'
import { Button } from '@mui/material'
import { useMutation } from '@tanstack/react-query'

import { useMessagesContext } from '@/contexts/messages'
import { MetaType } from '@/api/chat/types'
import { LoadingMessage } from '../../loading-message'
import { MessageBubble } from '../../message-bubble'
import { useChatStore } from '@/stores/use-chat-store'
import { useWalletStore } from '@/stores/use-wallet-store'
import { walletApi } from '@/api/wallet'
import { WalletSelectMessage } from '../../wallet-select-message'
import { useWalletList } from '@/hooks/use-wallet-list'

export const WalletChangeMessage = () => {
  const { t } = useTranslation()
  const { chatInputEl, setQuestion } = useChatStore()
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
  })

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
  if (isError) {
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
        <div className="flex items-center">
          <p className="mr-2">
            {t('such-as')} "{t('wallet.change-name.example')}"
          </p>
          <Button
            variant="outlined"
            size="small"
            classes={{ root: '!py-0' }}
            onClick={() => {
              setQuestion(t('wallet.change-name.example'))
              chatInputEl?.focus()
            }}
          >
            {t('use-it')}
          </Button>
        </div>
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
