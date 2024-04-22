import { CHAT_CONFIG } from '@/config/chat'
import { WalletChoiceBubble } from './wallet-bubbles/wallet-choice-bubbles'
import { Message } from '@/stores/use-chat-store/types'
import { WalletBalance } from './wallet-bubbles/wallet-balance'
import { TwitterListBubble } from './twitter-list-bubble'
import { TxTokenBubbles } from './tx-token-bubble/tx-token-bubbles'
import { MonitorAddressBubble } from './monitor-address-bubble'
import { BalanceMessage } from '../balance-message'
import { CreateTokenMessage } from '../create-token-message'
import { TokenDetailBubble } from './token-detail-bubble'
import { ExMonitorBubble } from './ex-monitor-bubble'
import { PoolMonitorBubble } from './pool-monitor-bubble'
import { MonitorWalletListBubble } from './monitor-wallet-list-bubble'

interface Props {
  msg: Message
}

export const IntentMessage = ({ msg }: Props) => {
  const { intentSelectWalletType, intentTxToken } = CHAT_CONFIG
  const { walletList } = CHAT_CONFIG.answerType
  const {
    walletBalance,
    twitterList,
    moniotrWallet,
    monitorWalletFail,
    twitterCancelList,
    createTokenNoWallet,
    createTokenHaveWallet,
    tokenDetail,
    monitorExList,
    cancelExList,
    monitorPoolList,
    poolCancelList,
    walletCancelList,
  } = CHAT_CONFIG.metadataType
  const answerType = msg.answer_type || '[not_type]'
  const metaType = msg.meta?.type || '[not_type]'

  // Balances(Wallet list)
  if (walletList.startsWith(answerType) || walletList.startsWith(metaType)) {
    return <BalanceMessage meta={msg.meta} />
  }

  // Change name wallet list
  if (intentSelectWalletType.includes(metaType)) {
    return <WalletChoiceBubble msg={msg.meta!}></WalletChoiceBubble>
  }

  // Wallet token balance
  if (metaType == walletBalance) {
    return <WalletBalance msg={msg.meta!}></WalletBalance>
  }

  // twitter list
  if (metaType == twitterList || metaType == twitterCancelList) {
    return <TwitterListBubble></TwitterListBubble>
  }

  // Tx Token
  if (intentTxToken.includes(metaType)) {
    return <TxTokenBubbles msg={msg.meta!}></TxTokenBubbles>
  }

  // Monitor wallet
  if (metaType == moniotrWallet) {
    return <MonitorAddressBubble msg={msg.meta!}></MonitorAddressBubble>
  }

  // Unmonitor wallet
  if (metaType == walletCancelList) {
    return <MonitorWalletListBubble></MonitorWalletListBubble>
  }

  // Create token
  if (metaType === createTokenNoWallet || metaType == createTokenHaveWallet) {
    return (
      <CreateTokenMessage
        hasWallet={metaType === createTokenHaveWallet}
        chain={msg.meta?.chain}
      />
    )
  }

  // token detail
  if (metaType == tokenDetail) {
    return <TokenDetailBubble msg={msg.meta!}></TokenDetailBubble>
  }

  // monitor CEX
  if (metaType == monitorExList || metaType == cancelExList) {
    return <ExMonitorBubble></ExMonitorBubble>
  }

  // monitor new Pool
  if (metaType == monitorPoolList || metaType == poolCancelList) {
    return <PoolMonitorBubble></PoolMonitorBubble>
  }

  // console.log('type', msg.msgs)

  return <></>
}
