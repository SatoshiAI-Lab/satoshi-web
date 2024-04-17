import { MdOutlineFlashOn } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'

import { useChatMigrating } from '@/hooks/use-chat-migrating'
import { useChatStore } from '@/stores/use-chat-store'
import { useMessages } from '@/hooks/use-messages'

export const MessageAlert: React.FC = () => {
  const { t } = useTranslation()
  const { unreadMessages, setUnreadMessage } = useChatStore()
  // const { addMonitorMessage } = useChatMigrating()
  const { addMonitorMessages } = useMessages()

  const expandMessage = () => {
    addMonitorMessages(unreadMessages)
    setUnreadMessage([])
  }

  return (
    <div
      className={clsx(
        'absolute border-2 border-blue-500 transition-all rounded-md',
        'z-50 bg-[#ffffff] cursor-pointer px-10 left-[50%] top-[5%]',
        'animate-shake animate-infinite animate-ease-linear animate-duration-[1000ms]'
      )}
    >
      <button
        className="py-2 flex justify-center items-center text-blue-500"
        onClick={expandMessage}
      >
        <MdOutlineFlashOn />{' '}
        <span className="mx-1">{unreadMessages.length}</span>{' '}
        {t('folded-message')}
      </button>
    </div>
  )
}

export default MessageAlert
