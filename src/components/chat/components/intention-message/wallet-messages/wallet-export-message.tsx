import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

import { MetaType } from '@/api/chat/types'
import { useMessagesContext } from '@/contexts/messages'
import { useWalletStore } from '@/stores/use-wallet-store'
import { LoadingMessage } from '../../loading-message'
import { WalletSelectMessage } from '../../wallet-select-message'
import { walletApi } from '@/api/wallet'
import { MessageBubble } from '../../message-bubble'
import { ResponseCode } from '@/api/fetcher/types'
import { useWalletList } from '@/hooks/use-wallet-list'

export const WalletExportMessage = () => {
  const { t } = useTranslation()
  const { getMetaData } = useMessagesContext()
  const { wallet_name } = getMetaData<MetaType.WalletExport>()
  const { findWallet } = useWalletStore()
  const foundWallet = findWallet(wallet_name)
  const { getAllWallet } = useWalletList()

  const { data, isPending, isError, isSuccess, mutateAsync } = useMutation({
    mutationKey: [walletApi.exportPrivateKey.name],
    mutationFn: walletApi.exportPrivateKey,
    onError: (e) => toast.error(e.message),
  })
  const { data: wallet, code } = data ?? {}
  const isErr = isError || (code && code !== ResponseCode.Success)

  const onExport = (id?: string) => {
    mutateAsync({ wallet_id: id || foundWallet?.id! }).finally(getAllWallet)
  }

  // Auto export if `wallet_name` & target wallet is not empty.
  useEffect(() => {
    if (isEmpty(wallet_name) || !foundWallet) return
    onExport()
  }, [])

  // Exporting.
  if (isPending) {
    return <LoadingMessage children={t('wallet.export.exporting')} />
  }

  // Export error.
  if (isErr || !foundWallet) {
    return <MessageBubble children={t('wallet.export.failed')} />
  }

  // Export success.
  if (isSuccess && wallet) {
    return (
      <MessageBubble>
        <p>{t('export-wallet').replace('{}', wallet_name)}:</p>
        <p className="font-bold blur-sm hover:blur-none transition-all duration-300">
          {wallet.private_key}
        </p>
      </MessageBubble>
    )
  }

  // If `wallet_name` is empty, ask user to select a wallet.
  if (isEmpty(wallet_name)) {
    return (
      <WalletSelectMessage
        title={<div className="mb-1">{t('wallet.export.not-found')}</div>}
        onWalletClick={(w) => onExport(w.id)}
      />
    )
  }

  return <LoadingMessage children={t('waiting-moment')} />
}

export default WalletExportMessage
