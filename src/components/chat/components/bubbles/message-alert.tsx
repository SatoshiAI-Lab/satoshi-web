import { useChat } from '@/hooks/use-chat'
import { useChatStore } from '@/stores/use-chat-store'
import { MdOutlineFlashOn } from 'react-icons/md'

const MessageAlert: React.FC = () => {
  const { unreadMessages, setMessage, setUnreadMessage } = useChatStore()
  const { addMonitorMessage } = useChat()
  const expandMessage = () => {
    addMonitorMessage(unreadMessages)
    setUnreadMessage([])
  }
  return (
    <div
      className="absolute border-2 border-blue-500
     animate-shake animate-infinite animate-ease-linear animate-duration-[1000ms]
      transition-all rounded-md z-50 bg-[#ffffff]  cursor-pointer px-10 left-[50%] top-[5%]"
    >
      <button
        className="py-2 flex justify-center items-center text-blue-500"
        onClick={expandMessage}
      >
        <MdOutlineFlashOn />{' '}
        <span className="mx-1">{unreadMessages.length}</span> new intelligence
        alerts
      </button>
    </div>
  )
}

export { MessageAlert }
