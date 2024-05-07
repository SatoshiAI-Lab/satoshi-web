import { useMessagesContext } from '@/contexts/messages'
import { MessageMatchError } from '@/components/errors/message-match'
import { TxTokenBubbles } from './tx-messages/tx-token-bubbles'
import { WalletCreateMessage } from './wallet-messages/wallet-create-message'
import { WaleltDeleteMessage } from './wallet-messages/wallet-delete-message'
import { WalletChangeMessage } from './wallet-messages/wallet-change-message'
import { WalletCheckMessage } from './wallet-messages/wallet-check-message'
import { WalletImportMessage } from './wallet-messages/wallet-import-message'
import { WalletExportMessage } from './wallet-messages/wallet-export-message'
import { SubNewsMessage } from './sub-messages/sub-news-message'
import { SubTwitterMessage } from './sub-messages/sub-twitter-message'
import { SubExAnnMessage } from './sub-messages/sub-ann-message'
import { SubWalletMessage } from './sub-messages/sub-wallet-message'
import { SubPoolMessage } from './sub-messages/sub-pool-message'
import { TokenCreateMessage } from './token-messages/token-create'
import { CheckAddrMessage } from './check-messages/check-addr-message'
import { MessageBubble } from '../message-bubble'

export const IntentMessages = () => {
  const { metaType, message } = useMessagesContext()

  // Transaction category.
  if (metaType.isTx) return <TxTokenBubbles />

  // Wallet category.
  if (metaType.isWalletCreate) return <WalletCreateMessage />
  if (metaType.isWalletDelete) return <WaleltDeleteMessage />
  if (metaType.isWalletChange) return <WalletChangeMessage />
  if (metaType.isWalletCheck) return <WalletCheckMessage />
  if (metaType.isWalletImport) return <WalletImportMessage />
  if (metaType.isWalletExport) return <WalletExportMessage />

  // Subscription category.
  if (metaType.isSubNews) return <SubNewsMessage />
  if (metaType.isSubTwitter) return <SubTwitterMessage />
  if (metaType.isSubAnn) return <SubExAnnMessage />
  if (metaType.isSubWallet) return <SubWalletMessage />
  if (metaType.isSubPool) return <SubPoolMessage />

  // Token category.
  if (metaType.isTokenCreate) return <TokenCreateMessage />

  // Check category.
  if (metaType.isCheckAddr) return <CheckAddrMessage />

  // If `meta.type` is empty, show AI hints.
  if (metaType.isEmpty) return <MessageBubble children={message.text} />

  // No type matched.
  return (
    <MessageMatchError
      reason={message.meta?.type}
      reasonComponent={IntentMessages}
    />
  )
}
