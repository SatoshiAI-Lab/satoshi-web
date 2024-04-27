import React, { useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'
import { IoCopyOutline } from 'react-icons/io5'

import { MessageBubble } from '../../message-bubble'
import { useMessagesContext } from '@/contexts/messages'
import { MetaType } from '@/api/chat/types'
import { walletApi } from '@/api/wallet'
import { Platform } from '@/config/wallet'
import { PlatformSelectMessage } from '../../platform-select-message'
import { LoadingMessage } from '../../loading-message'
import { utilFmt } from '@/utils/format'
import { useClipboard } from '@/hooks/use-clipboard'

export const WalletImportMessage = () => {
  const { t } = useTranslation()
  const { getMetaData } = useMessagesContext()
  const { platform_name, private_key } = getMetaData<MetaType.WalletImport>()
  const platformIsEmpty = isEmpty(platform_name)
  const privateKeyIsEmpty = isEmpty(private_key)
  const { copy } = useClipboard()

  const { data, isPending, isError, isSuccess, mutateAsync } = useMutation({
    mutationKey: [walletApi.importPrivateKey.name],
    mutationFn: walletApi.importPrivateKey,
  })
  const { data: wallet, status = -1 } = data ?? {}

  // Auto import if all is not empty.
  useEffect(() => {
    if (platformIsEmpty || privateKeyIsEmpty) return

    mutateAsync({
      platform: platform_name as Platform,
      private_key,
    })
  }, [])

  // Importing.
  if (isPending) {
    return <LoadingMessage children={t('wallet.importing')} />
  }

  // Import error.
  if (isError && status !== 200) {
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
        <div className="flex items-center">
          {t('address')}:
          <span className="font-bold mx-1">{utilFmt.addr(wallet.address)}</span>
          <IoCopyOutline
            className="ml-1 cursor-pointer"
            onClick={() => copy(wallet.address)}
          />
        </div>
      </MessageBubble>
    )
  }

  // If `platform` is empty but `private key` is not empty.
  // Ask user to choose `platform`
  if (platformIsEmpty && !privateKeyIsEmpty) {
    return (
      <PlatformSelectMessage
        title={t('wallet.import.select-platform')}
        onClick={(p) => {
          mutateAsync({
            platform: p,
            private_key,
          })
        }}
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
