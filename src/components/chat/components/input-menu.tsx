import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AiOutlineSetting } from 'react-icons/ai'
import { BiSolidChess, BiSolidWalletAlt } from 'react-icons/bi'
import { BsVolumeUp, BsVolumeMute } from 'react-icons/bs'
import clsx from 'clsx'
import { motion } from 'framer-motion'

import { useBackground } from '@/hooks/use-background'
import { useShow } from '@/hooks/use-show'
import { MonitorEntryPointer } from '@/components/monitor/monitor-entry-point'
import { Wallet } from '@/components/wallet'
import { useDebounce } from '@/hooks/use-debounce'
import { useLive2DStore } from '@/stores/use-live2d-store'
import { useStorage } from '@/hooks/use-storage'
import { useWalletStore } from '@/stores/use-wallet-store'

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
  const { changeBackground } = useBackground()
  const { show, open, hidden } = useShow()
  const [walletOpen, setWalletOpen] = useState(false)
  const changeScene = useDebounce(changeBackground)
  const { isMute, setIsMute } = useLive2DStore()
  const { setIsMuted } = useStorage()
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  const { getWallets } = useWalletStore()

  const items = [
    {
      label: t('monitor'),
      icon: <AiOutlineSetting size={18} />,
      animate: AnimateType.Rotate,
      onClick: open,
    },
    {
      label: t('wallet'),
      icon: <BiSolidWalletAlt size={18} />,
      animate: AnimateType.Shake,
      transition: shakeTransition,
      onClick: () => {
        setWalletOpen(true)
        getWallets()
      },
    },
    {
      label: t('scene'),
      icon: <BiSolidChess size={18} />,
      animate: AnimateType.Rotate,
      onClick: changeScene,
    },
    {
      label: isMute ? t('unmute') : t('mute'),
      animate: AnimateType.Shake,
      transition: shakeTransition,
      icon: isMute ? (
        <BsVolumeMute fontSize={22} />
      ) : (
        <BsVolumeUp fontSize={22} />
      ),
      onClick() {
        setIsMute(!isMute)
        setIsMuted(String(!isMute)) // Cache model mute status.
      },
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
      <MonitorEntryPointer
        show={show}
        open={open}
        hidden={hidden}
      ></MonitorEntryPointer>
      <Wallet open={walletOpen} onClose={() => setWalletOpen(false)} />
    </>
  )
}

export default InputMenu
