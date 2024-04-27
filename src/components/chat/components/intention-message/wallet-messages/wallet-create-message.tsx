import React, { useEffect } from 'react'
import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { IoCopyOutline } from 'react-icons/io5'

import { MessageBubble } from '../../message-bubble'
import { useMessagesContext } from '@/contexts/messages'
import { MetaType } from '@/api/chat/types'
import { ChainSelectMessage } from '../../chain-select-message'
import { Platform } from '@/config/wallet'
import { LoadingMessage } from '../../loading-message'
import { walletApi } from '@/api/wallet'
import { useClipboard } from '@/hooks/use-clipboard'
import { utilFmt } from '@/utils/format'

export const WalletCreateMessage = () => {
  const { t } = useTranslation()
  const { getMetaData } = useMessagesContext()
  const { chain_name } = getMetaData<MetaType.WalletCreate>()
  const { copy } = useClipboard()

  const { data, isPending, isError, isSuccess, mutateAsync } = useMutation({
    mutationKey: [walletApi.createWallet.name],
    mutationFn: walletApi.createWallet,
  })
  const wallet = data?.data

  const onCreate = async (platform: Platform) => {
    mutateAsync({ platform })
  }

  useEffect(() => {
    if (isEmpty(chain_name)) return

    // TODO: dynamic platform from meta.
    onCreate(Platform.Evm)
  }, [])

  // Creating.
  if (isPending) {
    return <LoadingMessage>{t('wallet.creating')}</LoadingMessage>
  }

  // Create error.
  if (isError) {
    return <MessageBubble>{t('wallet.create.failed')}</MessageBubble>
  }

  // Create sucess.
  if (isSuccess && wallet) {
    return (
      <MessageBubble>
        <p>{t('wallet.create.success').replace('{}', chain_name)}</p>
        <p>
          {t('name')}: <span className="font-bold">{wallet?.name}</span>
        </p>
        <div className="flex items-center">
          <p className="mr-1">
            {t('address')}:{' '}
            <span className="font-bold">{utilFmt.addr(wallet?.address)}</span>
          </p>
          <IoCopyOutline
            className="cursor-pointer"
            onClick={() => copy(wallet?.address)}
          />
        </div>
      </MessageBubble>
    )
  }

  // `platform` is empty, select platform.
  if (isEmpty(chain_name)) {
    return <ChainSelectMessage onClick={onCreate} />
  }

  // Ask user to wait.
  return <LoadingMessage children={t('waiting-moment')} />
}

export default WalletCreateMessage
