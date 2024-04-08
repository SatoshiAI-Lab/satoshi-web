import { MonitorLabelSwitch } from './monitor-label-switch'
import { MonitorConfig } from '@/config/monitor'
import { useMonitorStore } from '@/stores/use-monitor-store'

import type { AnnouncementList } from '@/api/monitor/type'
import clsx from 'clsx'

interface Props {
  className?: string
}

export const MonitorEXInfo = ({ className }: Props) => {
  const { configData, setConfig } = useMonitorStore()

  const exList = configData?.announcement.content

  const onSwitch = async (item: AnnouncementList, checked: boolean) => {
    item.subscribed = checked

    const content = exList!
      .filter((item) => item.subscribed)
      .map((item) => item.id)

    const data = {
      message_type: MonitorConfig.announcement,
      content: content,
    }

    await setConfig(data)
  }

  return (
    <div className={clsx('px-10 pb-7', className)}>
      <div className="grid grid-cols-2 gap-x-5 gap-y-4 max-sm:grid-cols-1">
        {exList?.map((item, i) => {
          return (
            <MonitorLabelSwitch
              key={i}
              data={item}
              logo={`https://img.mysatoshi.ai/exchange/logo/${item.name}.png`}
              onSwitch={(checked) => onSwitch(item, checked)}
            ></MonitorLabelSwitch>
          )
        })}
      </div>
    </div>
  )
}
