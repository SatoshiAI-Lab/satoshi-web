import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AiOutlineSetting } from 'react-icons/ai'
import { BiSolidChess, BiSolidWalletAlt } from 'react-icons/bi'
import { BsVolumeUp, BsVolumeMute } from 'react-icons/bs'
import clsx from 'clsx'
import { motion } from 'framer-motion'

enum AnimateType {
  None,
  Rotate,
  Shake,
}

const shakeTransition = {
  transition: { duration: 0.2 },
}

export const InputMenu: React.FC<{ className?: string }> = (props) => {
  const { className = '' } = props
  const { t } = useTranslation()
  const [walletOpen, setWalletOpen] = useState(false)
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  const items = [
    {
      label: t('monitor'),
      icon: <AiOutlineSetting size={18} />,
      animate: AnimateType.Rotate,
      onClick: () => {},
    },
    {
      label: t('wallet'),
      icon: <BiSolidWalletAlt size={18} />,
      animate: AnimateType.Shake,
      transition: shakeTransition,
      onClick: () => {
        setWalletOpen(true)
      },
    },
    {
      label: t('scene'),
      icon: <BiSolidChess size={18} />,
      animate: AnimateType.Rotate,
      onClick: () => {},
    },
  ]

  return (
    <>
      <div className={clsx('flex mb-2 select-none text-white', className)}>
        {items.map((item, i) => {
          const isHovered = hoverIdx === i
          const animateType = {
            [AnimateType.Rotate]: {
              rotate: isHovered ? 180 : 0,
            },
            [AnimateType.Shake]: {
              x: isHovered ? [0, -2, 0, 2, 0] : [],
            },
            [AnimateType.None]: {},
          }

          return (
            <motion.div
              key={i}
              whileTap={{ scale: 0.8 }}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
              className={clsx(
                'flex items-center gap-1 transition-all mr-8',
                'cursor-pointer hover:drop-shadow-chat-menu max-sm:mr-4'
              )}
              onClick={item.onClick}
            >
              <motion.div
                animate={animateType[item.animate]}
                transition={item.transition}
              >
                {item.icon}
              </motion.div>
              <span className="break-keep">{item.label}</span>
            </motion.div>
          )
        })}
      </div>
    </>
  )
}

export default InputMenu
