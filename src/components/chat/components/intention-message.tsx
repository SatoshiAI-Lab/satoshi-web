import { ChatResponseAnswerMeta } from '@/api/chat/types'
import MessageBubble from './bubbles/message-bubble'
import { useTranslation } from 'react-i18next'
import { utilFmt } from '@/utils/format'
import { IoCopyOutline } from 'react-icons/io5'
import CopyToClipboard from 'react-copy-to-clipboard'
import toast from 'react-hot-toast'
import { CHAT_CONFIG } from '@/config/chat'
import { WalletChangeNameBubble } from './intention-message/wallet-bubbles/wallet-change-name-bubbles'
import { WalletListBubbles } from './intention-message/wallet-bubbles/wallet-list-bubble'
import { Message } from '@/stores/use-chat-store/types'
import { WalletBalance } from './intention-message/wallet-bubbles/wallet-balance'
import TwitterBubble from './bubbles/twitter-bubble'
import { TwitterListBubble } from './intention-message/twitter-list-bubble'
import { TxTokenBubbles } from './intention-message/tx-token-bubbles/tx-token-bubbles'

interface Props {
  msg: Message
}

export const IntentMessage = ({ msg }: Props) => {
  const { walletChangeName, walletList } = CHAT_CONFIG.answerType
  const {
    changeNameWalletList,
    walletBalance,
    twitterList,
    transactionConfirm,
  } = CHAT_CONFIG.metadataType

  // Wallet list
  if (msg.type == walletList || msg?.msgs?.type == walletList) {
    return <WalletListBubbles msg={msg.msgs!}></WalletListBubbles>
  }

  // Change name wallet list
  if (msg.msgs?.type == changeNameWalletList) {
    return <WalletChangeNameBubble msg={msg.msgs!}></WalletChangeNameBubble>
  }

  // Wallet token balance
  if (msg.msgs?.type == walletBalance) {
    return <WalletBalance msg={msg.msgs!}></WalletBalance>
  }

  // twitter list
  if (msg.msgs?.type == twitterList) {
    return <TwitterListBubble></TwitterListBubble>
  }

  // Tx
  if (msg.msgs?.type == transactionConfirm) {
    return <TxTokenBubbles msg={msg.msgs!}></TxTokenBubbles>
  }
}
