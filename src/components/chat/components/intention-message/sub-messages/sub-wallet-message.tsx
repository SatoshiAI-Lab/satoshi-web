import React, { useEffect, useMemo, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'
import { nanoid } from 'nanoid'
import { Dialog } from '@mui/material'

import { useMessagesContext } from '@/contexts/messages'
import { MetaType } from '@/api/chat/types'
import { monitorApi } from '@/api/monitor'
import { useMonitorStore } from '@/stores/use-monitor-store'
import { ResponseCode } from '@/api/fetcher/types'
import { LoadingMessage } from '../../loading-message'
import { MessageBubble } from '../../message-bubble'
import { MonitorConfig } from '@/config/monitor'
import { useShow } from '@/hooks/use-show'
import { DialogHeader } from '@/components/dialog-header'
import { MonitorWallet } from '@/components/monitor/monitor-wallet'

export const SubWalletMessage = () => {
  const { t } = useTranslation()
  const { getMetaData } = useMessagesContext()
  const { type, content } = getMetaData<MetaType.SubWallet>()
  const { configData, update } = useMonitorStore()
  const walletName = useMemo(() => content.slice(-4), [])

  const { data, isPending, isError, isSuccess, mutateAsync } = useMutation({
    mutationKey: [monitorApi.update.name],
    mutationFn: monitorApi.update,
  })
  const { data: wallet, code } = data ?? {}
  const isErr = isError || (code && code !== ResponseCode.Success)

  const addMonitors = () => {
    const monitored = configData?.trade.content ?? []
    const newMonitor: (typeof monitored)[number] = {
      name: walletName,
      address: content,
    }

    return [...monitored, newMonitor]
  }

  const removeMonitors = () => {
    return configData?.trade.content.filter((t) => t.address !== content) ?? []
  }

  const onMonitor = () => {
    mutateAsync({
      message_type: MonitorConfig.Trade,
      content: type === 'on' ? addMonitors() : removeMonitors(),
    }).finally(update)
  }

  const { show, open, hidden } = useShow()
  const idRef = useRef(nanoid())

  const onMonitorSetting = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const target = e.target as HTMLElement

    // If is target span, open monitor setting dialog.
    if (target.id === idRef.current) open()
  }

  useEffect(() => {
    if (isEmpty(type) || isEmpty(content)) return

    onMonitor()
  }, [])

  // Monitoring.
  if (isPending) {
    return <LoadingMessage children={t('monitor.setting')} />
  }

  // Monitor failed.
  if (isErr) {
    return (
      <MessageBubble
        children={
          type === 'on' ? t('monitor.on.failed') : t('monitor.off.failed')
        }
      />
    )
  }

  // Monitor success.
  if (isSuccess && wallet) {
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
          <DialogHeader text={t('monitor.wallet.title')} onClose={hidden} />
          <MonitorWallet />
        </Dialog>
      </>
    )
  }

  return <LoadingMessage children={t('waiting-moment')} />
}

export default SubWalletMessage
