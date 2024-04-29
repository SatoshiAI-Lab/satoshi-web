import React, { useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'

import { MessageBubble } from '../../message-bubble'
import { useMessagesContext } from '@/contexts/messages'
import { MetaType } from '@/api/chat/types'
import { walletApi } from '@/api/wallet'
import { Platform } from '@/config/wallet'
import { PlatformSelectMessage } from '../../platform-select-message'
import { LoadingMessage } from '../../loading-message'
import { ResponseCode } from '@/api/fetcher/types'
import { CopyAddr } from '@/components/copy-addr'
import { useWalletList } from '@/hooks/use-wallet-list'

export const WalletImportMessage = () => {
  const { t } = useTranslation()
  const { getMetaData } = useMessagesContext()
  const { platform_name, private_key } = getMetaData<MetaType.WalletImport>()
  const platformIsEmpty = isEmpty(platform_name)
  const privateKeyIsEmpty = isEmpty(private_key)
  const { getAllWallet } = useWalletList()

  const { data, isPending, isError, isSuccess, mutateAsync } = useMutation({
    mutationKey: [walletApi.importPrivateKey.name],
    mutationFn: walletApi.importPrivateKey,
  })
  const { data: wallet, code } = data ?? {}
  const isErr = isError || (code && code !== ResponseCode.Success)

  const onImport = (p: Platform) => {
    mutateAsync({
      platform: p || platform_name,
      private_key,
    }).finally(getAllWallet)
  }

  // Auto import if all is not empty.
  useEffect(() => {
    if (platformIsEmpty || privateKeyIsEmpty) return
  }, [])

  // Importing.
  if (isPending) {
    return <LoadingMessage children={t('wallet.importing')} />
  }

  // Import error.
  if (isErr) {
    return <MessageBubble children={t('wallet.import.failed')} />
  }

  // Import success.
  if (isSuccess && wallet) {
    return (
      <MessageBubble>
        <div>{t('wallet.import.success')}</div>
        <div>
          {t('name')}: <span className="font-bold">{wallet.name}</span>
        </div>
        <CopyAddr
          addr={wallet.address}
          prefix={<span className="mr-1">{t('address')}:</span>}
          iconSize={16}
          bold
        />
      </MessageBubble>
    )
  }

  // If `platform` is empty but `private key` is not empty.
  // Ask user to choose `platform`
  if (platformIsEmpty && !privateKeyIsEmpty) {
    return (
      <PlatformSelectMessage
        title={t('wallet.import.select-platform')}
        onClick={(p) => onImport(p)}
      />
    )
  }

  // If `private key` is empty but `platform` is not empty.
  // Ask user to enter `private key`
  if (privateKeyIsEmpty && !platformIsEmpty) {
    return <MessageBubble>pk empty, platform not</MessageBubble>
  }

  return <LoadingMessage children={t('waiting-moment')} />
}

export default WalletImportMessage
