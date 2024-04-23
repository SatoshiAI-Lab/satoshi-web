import React from 'react'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { IconButton } from '@mui/material'
import { IoIosArrowDown } from 'react-icons/io'
import { FaRegCirclePause } from 'react-icons/fa6'
import { FaCircle } from 'react-icons/fa'

interface Props extends React.ComponentProps<'div'> {
  isShow?: boolean
  showToBottom?: boolean
  showPasuse?: boolean
  onToBottomClick?: () => void
  onPasuseClick?: () => void
}

export const InputButtons = (props: Props) => {
  const {
    className,
    isShow,
    showToBottom,
    showPasuse,
    onToBottomClick,
    onPasuseClick,
  } = props

  const ButtonGetter = () => {
    if (showToBottom) {
      return (
        <IconButton
          onClick={onToBottomClick}
          className="!bg-slate-50 dark:!bg-zinc-800"
        >
          <IoIosArrowDown size={20} className="dark:text-white" />
        </IconButton>
      )
    }

    if (showPasuse) {
      return (
        <IconButton
          onClick={onPasuseClick}
          className="!bg-slate-50 dark:!bg-zinc-800"
        >
          <FaRegCirclePause
            size={20}
            className="text-red-500 dark:text-red-700"
          />
        </IconButton>
      )
    }

    // There must be an empty element,
    // otherwise will be no exit animation.
    return (
      <IconButton className="!bg-slate-50 dark:!bg-zinc-800">
        <FaCircle size={20} className="text-transparent bg-transparent" />
      </IconButton>
    )
  }

  return (
    <motion.div
      className={clsx(className)}
      animate={{
        opacity: isShow ? 1 : 0,
        y: isShow ? 0 : 56,
      }}
    >
      {ButtonGetter()}
    </motion.div>
  )
}

export default InputButtons
