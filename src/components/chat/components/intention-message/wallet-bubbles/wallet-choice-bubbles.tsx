import { ChatResponseAnswerMeta } from '@/api/chat/types'
import MessageBubble from '../../bubbles/message-bubble'
import { useTranslation } from 'react-i18next'
import { WalletList } from './wallet-list'
import { useChat } from '@/hooks/use-chat'

interface Props {
  msg: ChatResponseAnswerMeta
}

export const WalletChoiceBubble = ({ msg }: Props) => {
  const { t } = useTranslation()
  const { sendMsg, addMessageAndLoading } = useChat()

  // const onSelect = (wallet: ChatResponseWalletList) => {
  //   const question = t('delete.wallet.intent.text').replace('$1', wallet.name)
  //   addMessageAndLoading({ msg: question, position: 'right' })
  //   sendMsg({
  //     question,
  //   })
  // }

  return (
    <MessageBubble>
      <WalletList type={msg.type ?? ''}></WalletList>
    </MessageBubble>
  )
}
