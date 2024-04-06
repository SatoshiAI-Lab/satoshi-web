import { MonitorLabelSwitch } from './monitor-label-switch'
import { MonitorConfig } from '@/config/monitor'
import { useMonitorStore } from '@/stores/use-monitor-store'

import type { AnnouncementList, MonitorConfigData } from '@/api/monitor/type'

interface Props {
  data?: MonitorConfigData
}

export const MonitorEXInfo = ({ data }: Props) => {
  const { setConfig } = useMonitorStore()

  const exList = data?.announcement.content

  const onSwitch = async (item: AnnouncementList, checked: boolean) => {
    item.subscribed = checked

    const content = exList!
      .filter((item) => item.subscribed)
      .map((item) => item.id)

    const data = {
      message_type: MonitorConfig.announcement,
      content: content,
    }

    await setConfig(data, exList)
  }

  return (
    <div className="px-10 pb-7">
      <div className="grid grid-cols-2 gap-x-5 gap-y-4 max-sm:grid-cols-1">
        {exList?.map((item, i) => {
          return (
            <MonitorLabelSwitch
              key={i}
              data={item}
              onSwitch={(checked) => onSwitch(item, checked)}
            ></MonitorLabelSwitch>
          )
        })}
      </div>
    </div>
  )
}
