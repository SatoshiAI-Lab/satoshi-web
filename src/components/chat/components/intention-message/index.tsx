import { WalletChoiceBubble } from './wallet-messages/wallet-choice-bubbles'
import { WalletBalance } from './wallet-messages/wallet-balance'
import { TwitterListBubble } from './sub-messages/twitter-list-bubble'
import { TxTokenBubbles } from './tx-messages/tx-token-bubbles'
import { MonitorAddressBubble } from './sub-messages/monitor-address-bubble'
import { BalanceMessage } from '../balance-message'

import { TokenDetailBubble } from './check-messages/token-detail-bubble'
import { ExMonitorBubble } from './sub-messages/ex-monitor-bubble'
import { PoolMonitorBubble } from './sub-messages/pool-monitor-bubble'
import { MonitorWalletListBubble } from './sub-messages/monitor-wallet-list-bubble'

import { useMessagesContext } from '@/contexts/messages'
import { MessageMatchError } from '@/components/errors/message-match'
import { WalletCreateMessage } from './wallet-messages/wallet-create-message'
import { WaleltDeleteMessage } from './wallet-messages/wallet-delete-message'
import { WalletChangeMessage } from './wallet-messages/wallet-change-message'
import { WalletImportMessage } from './wallet-messages/wallet-import-message'
import { WalletExportMessage } from './wallet-messages/wallet-export-message'
import { SubNewsMessage } from './sub-messages/sub-news-message'
import { SubTwitterMessage } from './sub-messages/sub-twitter-message'
import { SubAnnMessage } from './sub-messages/sub-ann-message'
import { SubWalletMessage } from './sub-messages/sub-wallet-message'
import { SubPoolMessage } from './sub-messages/sub-pool-message'
import { TokenCreateMessage } from './token-messages/create-token'
import { CheckAddrMessage } from './check-messages/check-addr-message'

export const IntentMessages = () => {
  const { metaType, message } = useMessagesContext()

  // Transaction category.
  if (metaType.isTxConfirm) return <TxTokenBubbles />

  // Wallet category.
  if (metaType.isWalletCreate) return <WalletCreateMessage />
  if (metaType.isWalletDelete) return <WaleltDeleteMessage />
  // TODO: remove the temp.
  const temp = (message?.meta?.type ?? '') == 'change_name_wallet_list'
  if (metaType.isWalletChange || temp) return <WalletChangeMessage />
  if (metaType.isWalletImport) return <WalletImportMessage />
  if (metaType.isWalletExport) return <WalletExportMessage />

  // Subscript category.
  if (metaType.isSubNews) return <SubNewsMessage />
  if (metaType.isSubTwitter) return <SubTwitterMessage />
  if (metaType.isSubAnn) return <SubAnnMessage />
  if (metaType.isSubWallet) return <SubWalletMessage />
  if (metaType.isSubPool) return <SubPoolMessage />

  // Token category.
  if (metaType.isTokenCreate) return <TokenCreateMessage />

  // Check category.
  if (metaType.isCheckAddr) return <CheckAddrMessage />

  // // Balances(Wallet list)
  // if (walletList.startsWith(answerType) || walletList.startsWith(metaType)) {
  //   return <BalanceMessage meta={message.meta} />
  // }

  // // Change name wallet list
  // if (intentSelectWalletType.includes(metaType)) {
  //   return <WalletChoiceBubble msg={message.meta!}></WalletChoiceBubble>
  // }

  // // Wallet token balance
  // if (metaType == walletBalance) {
  //   return <WalletBalance msg={message.meta!}></WalletBalance>
  // }

  // // twitter list
  // if (metaType == twitterList || metaType == twitterCancelList) {
  //   return <TwitterListBubble></TwitterListBubble>
  // }

  // // Tx Token
  // if (intentTxToken.includes(metaType)) {
  //   return <TxTokenBubbles msg={message.meta!}></TxTokenBubbles>
  // }

  // // Monitor wallet
  // if (metaType == moniotrWallet) {
  //   return <MonitorAddressBubble msg={message.meta!}></MonitorAddressBubble>
  // }

  // // Unmonitor wallet
  // if (metaType == walletCancelList) {
  //   return <MonitorWalletListBubble></MonitorWalletListBubble>
  // }

  // // Create token
  // if (metaType === createTokenNoWallet || metaType == createTokenHaveWallet) {
  //   return (
  //     <CreateTokenMessage
  //       hasWallet={metaType === createTokenHaveWallet}
  //       chain={message.meta?.chain}
  //     />
  //   )
  // }

  // // token detail
  // if (metaType == tokenDetail) {
  //   return <TokenDetailBubble msg={message.meta!}></TokenDetailBubble>
  // }

  // // monitor CEX
  // if (metaType == monitorExList || metaType == cancelExList) {
  //   return <ExMonitorBubble></ExMonitorBubble>
  // }

  // // monitor new Pool
  // if (metaType == monitorPoolList || metaType == poolCancelList) {
  //   return <PoolMonitorBubble></PoolMonitorBubble>
  // }

  return (
    <MessageMatchError
      reason={message.meta?.type}
      reasonComponent={IntentMessages}
    />
  )
}
