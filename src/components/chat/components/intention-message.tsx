import { ChatResponseAnswerMeta } from '@/api/chat/types'
import MessageBubble from './bubbles/message-bubble'
import { useTranslation } from 'react-i18next'
import { utilFmt } from '@/utils/format'
import { IoCopyOutline } from 'react-icons/io5'
import CopyToClipboard from 'react-copy-to-clipboard'
import toast from 'react-hot-toast'
import { CHAT_CONFIG } from '@/config/chat'
import { WalletChangeNameBubble } from './wallet-bubbles/wallet-change-name-bubbles'
import { WalletListBubbles } from './wallet-bubbles/wallet-list-bubble'
import { Message } from '@/stores/use-chat-store/types'
import { WalletBalance } from './wallet-bubbles/wallet-balance'

interface Props {
  msg: Message
}

export const IntentMessage = ({ msg }: Props) => {
  const { walletChangeName, walletList } = CHAT_CONFIG.answerType
  const { changeNameWalletList, walletBalance }= CHAT_CONFIG.metadataType

  if (msg.type == walletList) {
    return <WalletListBubbles msg={msg.msgs!}></WalletListBubbles>
  }

  if (msg.msgs?.type == changeNameWalletList) {
    return <WalletChangeNameBubble msg={msg.msgs!}></WalletChangeNameBubble>
  }

  if (msg?.msgs?.type == walletList) {
    return <WalletListBubbles msg={msg.msgs!}></WalletListBubbles>
  }

  if (msg?.msgs?.type == walletBalance) {
    return <WalletBalance msg={msg.msgs!}></WalletBalance>
  }
}
