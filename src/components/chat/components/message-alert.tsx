import { MdOutlineFlashOn } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import { clsx } from 'clsx'
import { Tooltip } from '@mui/material'

import { useChatStore } from '@/stores/use-chat-store'
import { useMessages } from '@/hooks/use-messages'

export const MessageAlert: React.FC = () => {
  const { t } = useTranslation()
  const { unreadMessages, setUnreadMessage } = useChatStore()
  const { addMonitorMessages } = useMessages()

  const expandMessage = () => {
    addMonitorMessages(unreadMessages)
    setUnreadMessage([])
  }

  return (
    <Tooltip title={t('click-to-show')}>
      <div
        className={clsx(
          'sticky top-0 border-2 border-slate-100 flex justify-center items-center',
          'bg-slate-100 w-full py-2 rounded-md cursor-pointer text-primary',
          'hover:bg-white'
        )}
        onClick={expandMessage}
      >
        <MdOutlineFlashOn />{' '}
        <span className="mx-1">{unreadMessages.length}</span>{' '}
        {t('folded-message')}
      </div>
    </Tooltip>
  )
}

export default MessageAlert
