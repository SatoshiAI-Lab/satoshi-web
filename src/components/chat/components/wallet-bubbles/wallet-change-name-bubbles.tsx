import {
  ChatResponseAnswerMeta,
  ChatResponseWalletList,
} from '@/api/chat/types'
import MessageBubble from '../bubbles/message-bubble'
import { useTranslation } from 'react-i18next'
import { WalletList } from './wallet-list'
import { useChat } from '@/hooks/use-chat'

interface Props {
  msg: ChatResponseAnswerMeta
}

export const WalletChangeNameBubble = ({ msg }: Props) => {
  const { t } = useTranslation()
  const { sendMsg } = useChat()

  if (!msg.data?.length) {
    return
  }

  const onSelect = (wallet: ChatResponseWalletList) => {
    sendMsg({
      question: wallet.name,
    })
  }

  return (
    <MessageBubble>
      <WalletList data={msg.data} onClickItem={onSelect} isSelect></WalletList>
    </MessageBubble>
  )
}
