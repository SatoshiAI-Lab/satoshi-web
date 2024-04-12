import { CHAT_CONFIG } from '@/config/chat'
import { WalletChoiceBubble } from './wallet-bubbles/wallet-choice-bubbles'
import { WalletListBubbles } from './wallet-bubbles/wallet-list-bubble'
import { Message } from '@/stores/use-chat-store/types'
import { WalletBalance } from './wallet-bubbles/wallet-balance'
import { TwitterListBubble } from './twitter-list-bubble'
import { TxTokenBubbles } from './tx-token-bubbles'
import { MonitorAddressBubble } from './monitor-address-bubble'
import MyWalletsBubble from '../bubbles/my-wallets-bubble'
import CreateTokenBubble from '../bubbles/create-token-bubble'
import { TokenDetailBubble } from './token-detail-bubble'
import { ExMonitorBubble } from './ex-monitor-bubble'
import { PoolMonitorBubble } from './pool-monitor-bubble'
import { MonitorWalletList } from '@/components/monitor/monitor-wallet-list'
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

  const metaType = msg?.msgs?.type!

  // Balances(Wallet list)
  if (msg.type == walletList || metaType == walletList) {
    return <MyWalletsBubble meta={msg.msgs} />
  }

  // Change name wallet list
  if (intentSelectWalletType.includes(metaType)) {
    return <WalletChoiceBubble msg={msg.msgs!}></WalletChoiceBubble>
  }

  // Wallet token balance
  if (metaType == walletBalance) {
    return <WalletBalance msg={msg.msgs!}></WalletBalance>
  }

  // twitter list
  if (metaType == twitterList || metaType == twitterCancelList) {
    return <TwitterListBubble></TwitterListBubble>
  }

  // Tx Token
  if (intentTxToken.includes(metaType)) {
    return <TxTokenBubbles msg={msg.msgs!}></TxTokenBubbles>
  }

  // Monitor wallet
  if (metaType == moniotrWallet) {
    return <MonitorAddressBubble msg={msg.msgs!}></MonitorAddressBubble>
  }

  // Unmonitor wallet
  if (metaType == walletCancelList) {
    return <MonitorWalletListBubble></MonitorWalletListBubble>
  }

  // Create token
  if (metaType === createTokenNoWallet || metaType == createTokenHaveWallet) {
    return <CreateTokenBubble hasWallet={metaType === createTokenHaveWallet} />
  }

  // token detail
  if (metaType == tokenDetail) {
    return <TokenDetailBubble msg={msg.msgs!}></TokenDetailBubble>
  }

  // monitor CEX
  if (metaType == monitorExList || metaType == cancelExList) {
    return <ExMonitorBubble></ExMonitorBubble>
  }

  // monitor new Pool
  if (metaType == monitorPoolList || metaType == poolCancelList) {
    return <PoolMonitorBubble></PoolMonitorBubble>
  }

  return <></>
}
