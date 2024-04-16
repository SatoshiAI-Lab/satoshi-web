import { useTranslation } from 'react-i18next'

import { MessageBubble } from '../../message-bubble'
import { ChatResponseAnswerMeta } from '@/api/chat/types'

interface Props {
  msg: ChatResponseAnswerMeta
}

export const WalletListBubbles = ({ msg }: Props) => {
  const { t } = useTranslation()

  if (!msg.data?.length) {
    return <></>
    // return <MessageBubble>{t('wallet.empty')}</MessageBubble>
  }

  return (
    <>
      <MessageBubble>
        {/* <WalletList data={msg.data}></WalletList> */}
        {/* <div className='mt-2 text-center text-gray-500 text-sm'>{t('wallet.list.tips')}</div> */}
      </MessageBubble>
    </>
  )
}
