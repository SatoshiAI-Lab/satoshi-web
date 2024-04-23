import { MdOutlineFlashOn } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import { clsx } from 'clsx'
import { Tooltip } from '@mui/material'

import { useChat } from '@/hooks/use-chat'
import { useChatStore } from '@/stores/use-chat-store'

export const MessageAlert: React.FC = () => {
  const { unreadMessages, setUnreadMessage } = useChatStore()
  const { addMonitorMessage } = useChat()
  const { t } = useTranslation()

  const expandMessage = () => {
    addMonitorMessage(unreadMessages)
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
        {t('new-intelligence-alerts')}
      </div>
    </Tooltip>
  )
}

export default MessageAlert
