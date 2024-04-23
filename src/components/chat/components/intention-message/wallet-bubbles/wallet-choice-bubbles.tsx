import { useTranslation } from 'react-i18next'

import { ChatResponseMeta } from '@/api/chat/types'
import { MessageBubble } from '../../message-bubble'
import { WalletList } from './wallet-list'
import { useChatMigrating } from '@/hooks/use-chat-migrating'
import { useChat } from '@/hooks/use-chat'

interface Props {
  msg: ChatResponseMeta
}

export const WalletChoiceBubble = ({ msg }: Props) => {
  const { t } = useTranslation()
  // const { sendMsg } = useChatMigrating()
  // const { sendChat } = useChat()

  // const onSelect = (wallet: ChatResponseWalletList) => {
  //   const question = t('delete.wallet.intent.text').replace('$1', wallet.name)
  //   sendChat({ question })
  // }
  return (
    <MessageBubble>
      <WalletList type={msg.type ?? ''} chain={msg.chain ?? ''} />
    </MessageBubble>
  )
}
