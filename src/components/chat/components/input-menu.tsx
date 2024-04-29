import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AiOutlineSetting } from 'react-icons/ai'
import { BiSolidChess, BiSolidWalletAlt } from 'react-icons/bi'
import { BsVolumeUp, BsVolumeMute } from 'react-icons/bs'
import { PiBroom } from 'react-icons/pi'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

import { useBackground } from '@/hooks/use-background'
import { useShow } from '@/hooks/use-show'
import { MonitorDialog } from '@/components/monitor/monitor-dialog'
import { Wallet } from '@/components/wallet'
import { useDebounce } from '@/hooks/use-debounce'
import { useLive2DStore } from '@/stores/use-live2d-store'
import { useStorage } from '@/hooks/use-storage'
import { useUserStore } from '@/stores/use-user-store'
import { useLoginAuthStore } from '@/stores/use-need-login-store'
import { useWalletManage } from '@/hooks/use-wallet'
import { useChat } from '@/hooks/use-chat'
import { useEnv } from '@/hooks/use-env'

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
  const { setShow } = useLoginAuthStore()
  const { refetchWallets } = useWalletManage()
  const { isLogined } = useUserStore()
  const { clearHistory } = useChat()
  const { isDev } = useEnv()

  const items = [
    {
      label: t('monitor'),
      title: t('monitor.intro'),
      icon: <AiOutlineSetting size={18} />,
      animate: AnimateType.Rotate,
      onClick: () => {
        if (!isLogined) {
          setShow(true)
          return
        }
        open()
      },
    },
    {
      label: t('wallet'),
      title: t('wallet.intro'),
      icon: <BiSolidWalletAlt size={18} />,
      animate: AnimateType.Shake,
      transition: shakeTransition,
      onClick: async () => {
        if (!isLogined) {
          setShow(true)
          return
        }
        setWalletOpen(true)
        refetchWallets()
      },
    },
    {
      label: t('scene'),
      title: t('scene.intro'),
      icon: <BiSolidChess size={18} />,
      animate: AnimateType.Rotate,
      onClick: changeScene,
    },
    {
      label: isMute ? t('unmute') : t('mute'),
      title: t('mute.intro'),
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

  // Clear functional, only dev mode use.
  if (isDev) {
    items.push({
      label: t('chat.clear-history'),
      title: t('clear.intro'),
      animate: AnimateType.Shake,
      icon: <PiBroom size={18} />,
      onClick: clearHistory,
    })
  }

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
                'cursor-pointer max-sm:mr-4 drop-shadow-bold-dark'
              )}
              onClick={item.onClick}
              title={item.title}
            >
              <motion.div
                animate={animateType[item.animate]}
                transition={item.transition}
              >
                {item.icon}
              </motion.div>
              <span className="break-keep not-used-dark:text-gray-300">
                {item.label}
              </span>
            </motion.div>
          )
        })}
      </div>
      <MonitorDialog show={show} open={open} hidden={hidden} />
      <Wallet open={walletOpen} onClose={() => setWalletOpen(false)} />
    </>
  )
}

export default InputMenu
