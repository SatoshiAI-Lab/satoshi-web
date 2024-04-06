import { utilFmt } from '@/utils/format'
import CopyToClipboard from 'react-copy-to-clipboard'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { IoCopyOutline } from 'react-icons/io5'
import MessageBubble from '../bubbles/message-bubble'
import { ChatResponseAnswerMeta } from '@/api/chat/types'
import { WalletList } from './wallet-list'

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
        <WalletList data={msg.data}></WalletList>
        <div className='mt-2 text-center text-gray-500 text-sm'>{t('wallet.list.tips')}</div>
      </MessageBubble>
    </>
  )
}
