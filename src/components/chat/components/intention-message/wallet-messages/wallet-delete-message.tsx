import React from 'react'

import { useMessagesContext } from '@/contexts/messages'
import { useWalletManage } from '@/hooks/use-wallet'
import { MetaType } from '@/api/chat/types'

export const WaleltDeleteMessage = () => {
  const { message, getMetaData } = useMessagesContext()
  const { wallet_name } = getMetaData<MetaType.WalletDelete>()
  const { isRemoving, removeWallet } = useWalletManage()

  console.log('delete wallet', getMetaData)

  return <div>WaleltDeleteMessage WaleltDeleteMessage</div>
}

export default WaleltDeleteMessage
