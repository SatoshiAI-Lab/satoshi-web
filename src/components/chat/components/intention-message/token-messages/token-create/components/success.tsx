import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { UserCreateWalletResp } from '@/api/wallet/params'

import { MessageBubble } from '../../../../message-bubble'
import { Wallet } from '@/components/wallet'
import { useWalletStore } from '@/stores/use-wallet-store'
import { CopyAddr } from '@/components/copy-addr'

interface Props {
  tokenName?: string
  tokenAddr?: string
  walletName?: string
}

export const TokenCreateSuccess = (props: Props) => {
  const { tokenName = '', tokenAddr = '', walletName = '' } = props
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const { currentWallet } = useWalletStore()

  return (
    <MessageBubble className="w-bubble">
      <Wallet
        open={open}
        onClose={() => setOpen(false)}
        showButtons={false}
        onlyWallet={currentWallet as UserCreateWalletResp}
      />
      <div className="font-bold">
        {t('create-token.success')}: {tokenName}
      </div>
      <div className="my-6">
        <div>{t('token-addr')}:</div>
        <div className="flex items-center">
          {tokenAddr}
          <CopyAddr addr={tokenAddr} iconSize={16} />
        </div>
      </div>
      <div>
        {t('create-token.success-all')}:
        <span
          className="text-primary font-bold ml-1 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          {walletName}
        </span>
      </div>
    </MessageBubble>
  )
}

export default TokenCreateSuccess
