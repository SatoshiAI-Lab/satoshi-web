import React from 'react'
import clsx from 'clsx'
import { motion } from 'framer-motion'

import type { MessageRole } from '@/stores/use-chat-store/types'

interface MessageBubbleProps {
  className?: string
  children?: React.ReactNode
  role?: MessageRole
  isLoading?: boolean
  showNull?: boolean
  xAnime?: boolean
  disableAnime?: boolean
}

export const MessageBubble = (props: MessageBubbleProps) => {
  const {
    children,
    role = 'assistant',
    isLoading,
    className = '',
    disableAnime = false,
  } = props

  return (
    <motion.div
      initial={disableAnime ? {} : { y: 20, opacity: 1 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.1 }}
      className={clsx(
        'px-4 py-[0.55rem] mr-10 bg-slate-100 rounded max-w-lg',
        'my-1 break-all shadow-bubble hover:bg-white transition-all',
        'max-lg:max-w-4xl md:max-w-xl max-sm:mr-4 max-sm:max-w-[14rem]',
        '2xl:max-w-4xl items-cneter gap-0 whitespace-pre-line',
        !children || children.toString().trim() === '' ? 'hidden' : '',
        role === 'assistant' && 'self-start',
        role === 'system' && 'self-center',
        role === 'user' && 'self-end',
        isLoading ? 'gap-2' : '',
        className
      )}
    >
      {children}
    </motion.div>
  )
}

export default MessageBubble
