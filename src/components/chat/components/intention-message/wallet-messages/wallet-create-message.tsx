import React, { useEffect } from 'react'
import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'

import { MessageBubble } from '../../message-bubble'
import { useMessagesContext } from '@/contexts/messages'
import { MetaType } from '@/api/chat/types'
import { PlatformSelectMessage } from '../../platform-select-message'
import { Platform } from '@/config/wallet'
import { LoadingMessage } from '../../loading-message'
import { walletApi } from '@/api/wallet'
import { ResponseCode } from '@/api/fetcher/types'
import { CopyAddr } from '@/components/copy-addr'
import { useWalletList } from '@/hooks/use-wallet-list'

export const WalletCreateMessage = () => {
  const { t } = useTranslation()
  const { getMetaData } = useMessagesContext()
  const { platform_name } = getMetaData<MetaType.WalletCreate>()
  const { getAllWallet } = useWalletList()

  const { data, isPending, isError, isSuccess, mutateAsync } = useMutation({
    mutationKey: [walletApi.createWallet.name],
    mutationFn: walletApi.createWallet,
  })
  const { data: wallet, code } = data ?? {}
  const isErr = isError || (code && code !== ResponseCode.Success)

  const onCreate = async (platform: Platform) => {
    mutateAsync({ platform }).finally(getAllWallet)
  }

  useEffect(() => {
    if (isEmpty(platform_name)) return

    onCreate(platform_name)
  }, [])

  // Creating.
  if (isPending) {
    return <LoadingMessage children={t('wallet.creating')} />
  }

  // Create error.
  if (isErr) {
    return <MessageBubble children={t('wallet.create.failed')} />
  }

  // Create sucess.
  if (isSuccess && wallet) {
    return (
      <MessageBubble>
        <p>{t('wallet.create.success').replace('{}', platform_name)}</p>
        <p>
          {t('name')}: <span className="font-bold">{wallet?.name}</span>
        </p>
        <div className="flex items-center">
          <CopyAddr
            prefix={<span className="mr-1">{t('address')}:</span>}
            addr={wallet.address}
            bold
            iconSize={16}
          />
        </div>
      </MessageBubble>
    )
  }

  // `platform` is empty, select platform.
  if (isEmpty(platform_name)) {
    return (
      <PlatformSelectMessage
        title={t('wallet.create.select-chain')}
        onClick={onCreate}
      />
    )
  }

  // Ask user to wait.
  return <LoadingMessage children={t('waiting-moment')} />
}

export default WalletCreateMessage
