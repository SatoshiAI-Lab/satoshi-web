import React, { forwardRef } from 'react'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'

import { useMessagesContext } from '@/contexts/messages'

interface Props extends React.ComponentProps<'div'> {
  enableAnime?: boolean
}

type Ref = React.ForwardedRef<HTMLDivElement>

export const MessageBubble = forwardRef((props: Props, ref: Ref) => {
  const { children, className, enableAnime = false, onClick } = props
  const { message, roleType } = useMessagesContext()

  return (
    <motion.div
      ref={ref}
      initial={enableAnime ? { y: 20, opacity: 1 } : {}}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.1 }}
      data-message-id={message.id}
      onClick={onClick}
      className={clsx(
        'px-4 py-2 mr-10 bg-slate-100 rounded max-w-lg',
        'my-1 break-all shadow-bubble hover:bg-white transition-all',
        'max-lg:max-w-4xl md:max-w-xl max-sm:mr-4 max-sm:max-w-[14rem]',
        '2xl:max-w-4xl items-cneter gap-0 whitespace-pre-line',
        'not-used-dark:bg-zinc-800 not-used-dark:text-gray-300 not-used-dark:hover:bg-[#232325]',
        !children || children.toString().trim() === '' ? 'hidden' : '',
        roleType.isAssistant && 'self-start',
        roleType.isSystem && '!max-w-[unset] self-stretch text-center',
        roleType.isUser && 'self-end',
        className
      )}
    >
      {children}
    </motion.div>
  )
})

export default MessageBubble
