import React from 'react'

import { MetaType } from '@/api/chat/types'
import { useMessagesContext } from '@/contexts/messages'
import { MyWalletsMessage } from './my-wallets-message'

export const WalletCheckMessage = () => {
  const { getMetaData } = useMessagesContext()
  const { chain_name } = getMetaData<MetaType.WalletCheck>()

  chain_name

  return <MyWalletsMessage />
}

export default WalletCheckMessage
