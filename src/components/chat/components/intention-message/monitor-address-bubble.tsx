import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { nanoid } from 'nanoid'
import { Dialog } from '@mui/material'

import { ChatResponseAnswerMeta } from '@/api/chat/types'
import { useShow } from '@/hooks/use-show'
import { DialogHeader } from '@/components/dialog-header'
import { MonitorWallet } from '@/components/monitor/monitor-wallet'
import MessageBubble from '../bubbles/message-bubble'

interface Props {
  msg: ChatResponseAnswerMeta
}

export const MonitorAddressBubble = ({ msg }: Props) => {
  const { t } = useTranslation()
  const { show, open, hidden } = useShow()
  const idRef = useRef(nanoid())

  const onMonitorSetting = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const target = e.target as HTMLElement

    // If is target span, open monitor setting dialog.
    if (target.id === idRef.current) open()
  }

  return (
    <>
      <MessageBubble>
        <div>{t('monitor.wallet.bubble.text1')}</div>
        <div>{t('monitor.wallet.bubble.text2')}</div>
        <div
          onClick={onMonitorSetting}
          dangerouslySetInnerHTML={{
            __html: t('monitor.addr').replace(
              '{}',
              `<span id="${
                idRef.current
              }" class="text-primary cursor-pointer">${t(
                'monitor.addr-track'
              )}</span>`
            ),
          }}
        ></div>
      </MessageBubble>
      <Dialog open={show} onClose={hidden}>
        <DialogHeader
          text={<>{t('monitor.wallet.title')}</>}
          onClose={hidden}
        ></DialogHeader>
        <MonitorWallet></MonitorWallet>
      </Dialog>
    </>
  )
}
