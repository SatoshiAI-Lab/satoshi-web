import { CHAT_CONFIG } from '@/config/chat'
import { WalletChoiceBubble } from './wallet-bubbles/wallet-choice-bubbles'
import { WalletListBubbles } from './wallet-bubbles/wallet-list-bubble'
import { Message } from '@/stores/use-chat-store/types'
import { WalletBalance } from './wallet-bubbles/wallet-balance'
import { TwitterListBubble } from './twitter-list-bubble'
import { TxTokenBubbles } from './tx-token-bubbles/tx-token-bubbles'
import { MonitorAddressBubble } from './monitor-address-bubble'
import MyWalletsBubble from '../bubbles/my-wallets-bubble'

interface Props {
  msg: Message
}

export const IntentMessage = ({ msg }: Props) => {
  const { intentSelectWalletType } = CHAT_CONFIG
  const { walletList } = CHAT_CONFIG.answerType
  const {
    walletBalance,
    twitterList,
    transactionConfirm,
    moniotrWallet,
    monitorWalletFail,
  } = CHAT_CONFIG.metadataType

  const metaType = msg?.msgs?.type!

  // Wallet list
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
  if (metaType == twitterList) {
    return <TwitterListBubble></TwitterListBubble>
  }

  // Tx Token
  if (metaType == transactionConfirm) {
    return <TxTokenBubbles msg={msg.msgs!}></TxTokenBubbles>
  }

  // Monitor wallet
  if (metaType == moniotrWallet) {
    return <MonitorAddressBubble msg={msg.msgs!}></MonitorAddressBubble>
  }
}
