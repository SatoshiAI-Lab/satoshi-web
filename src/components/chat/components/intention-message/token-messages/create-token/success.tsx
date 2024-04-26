import React, { useState } from 'react'
import { AiOutlineCopy } from 'react-icons/ai'
import { useTranslation } from 'react-i18next'

import MessageBubble from '../../../message-bubble'
import { useClipboard } from '@/hooks/use-clipboard'
import { Wallet } from '@/components/wallet'
import { useWalletStore } from '@/stores/use-wallet-store'

import type { UserCreateWalletResp } from '@/api/wallet/params'

interface Props {
  tokenName?: string
  tokenAddr?: string
  walletName?: string
}

const CreateTokenSuccess = (props: Props) => {
  const { tokenName = '', tokenAddr = '', walletName = '' } = props
  const { t } = useTranslation()
  const { copy } = useClipboard()
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
          <AiOutlineCopy
            className="ml-1 cursor-pointer"
            onClick={() => copy(tokenAddr)}
          />
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

export default CreateTokenSuccess
