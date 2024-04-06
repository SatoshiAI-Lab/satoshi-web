import { useState } from 'react'
import { Dialog } from '@mui/material'

import { useShow } from '@/hooks/use-show'
import { DialogHeader } from '../dialog-header'
import { MonitorMenu } from './monitor-menu'
import { MonitorWallet } from './monitor-wallet'
import { MonitorTwitter } from './monitor-twitter'
import { MonitorPools } from './monitor-pools'
import { MonitorNews } from './monitor-news'
import { MonitorEXInfo } from './monitor-ex-info'
import { useTranslation } from 'react-i18next'
import { monitorApi } from '@/api/monitor'
import { useQuery } from '@tanstack/react-query'
import { useMonitorStore } from '@/stores/use-monitor-store'

interface Props {
  show: boolean
  open: () => void
  hidden: () => void
}

export enum MonitorMenuType {
  wallet,
  twitter,
  pools,
  news,
  exInfo,
}

interface Config {
  comp: JSX.Element
  title: string
}

export const MonitorEntryPointer = (props: Props) => {
  const { t } = useTranslation()
  const { show, hidden } = props
  const { show: showSub, open: openShub, hidden: hiddenSub } = useShow(false)
  const [config, setConfig] = useState<Config>()

  const { configData: data } = useMonitorStore()

  const menuConfig = {
    [MonitorMenuType.wallet]: {
      comp: <MonitorWallet data={data} />,
      title: t('monitor.wallet.title'),
    },
    [MonitorMenuType.twitter]: {
      comp: <MonitorTwitter data={data} />,
      title: t('monitor.twitter.title'),
    },
    [MonitorMenuType.pools]: {
      comp: <MonitorPools data={data} />,
      title: t('monitor.pools.title'),
    },
    [MonitorMenuType.news]: {
      comp: <MonitorNews data={data} />,
      title: t('monitor.news.title'),
    },
    [MonitorMenuType.exInfo]: {
      comp: <MonitorEXInfo data={data} />,
      title: t('monitor.exinfo.title'),
    },
  }

  const handleOpenMonitorSetting = (type: MonitorMenuType) => {
    const config = menuConfig[type]
    if (config != null) {
      openShub()
      setConfig(config)
    }
  }

  const closeAll = () => {
    hiddenSub()
  }

  return (
    <>
      <Dialog open={show} onClose={hidden} scroll="body">
        <DialogHeader
          text={
            <span className="max-sm:text-[17px] max-sm:font-bold">
              {t('monitor')}
            </span>
          }
          showCloseBtn
          onClose={hidden}
        ></DialogHeader>
        <MonitorMenu onOpenItem={handleOpenMonitorSetting}></MonitorMenu>
      </Dialog>
      <Dialog
        open={showSub}
        scroll="body"
        classes={{ paper: '!mx-0 max-sm:w-[98vw] !max-w-[92vw]' }}
      >
        <DialogHeader
          text={
            <span className="max-sm:text-[17px] max-sm:font-bold">
              {config?.title}
            </span>
          }
          showCloseBtn
          showBackBtn
          onBack={hiddenSub}
          onClose={closeAll}
        ></DialogHeader>
        {config?.comp && config.comp}
      </Dialog>
    </>
  )
}
