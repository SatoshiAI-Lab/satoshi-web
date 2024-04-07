import { TwitterList } from '@/api/monitor/type'
import { MonitorConfig } from '@/config/monitor'
import { useMonitorStore } from '@/stores/use-monitor-store'
import { Switch } from '@mui/material'
import clsx from 'clsx'

interface Props {
  list: TwitterList[]
  className?: string
}

export const MonitorTwitterList = ({ list, className }: Props) => {
  const { setConfig } = useMonitorStore()

  const onSwitch = (item: TwitterList, checked: boolean) => {
    item.subscribed = checked

    const content = list
      .filter((item) => item.subscribed)
      .map((item) => item.twitter_id)

    const data = {
      message_type: MonitorConfig.twitter,
      content,
    }

    setConfig(data)
  }

  return (
    <div
      className={clsx(
        'inline-flex flex-col max-sm:mx-auto justify-start',
        className
      )}
    >
      {list?.map((item, i) => {
        return (
          <div
            className={`flex justify-between pl-3 pr-2 border border-black rounded-lg ${
              i !== list.length ? '!mb-3' : ''
            }`}
          >
            <div className="flex items-center">
              <img
                key={item.name}
                src={item.logo}
                alt="Logo"
                width={20}
                height={20}
                className="w-[20px] h-[20px] object-cover"
              />
              <span className="ml-5">{item.name}</span>
            </div>
            <Switch
              checked={item.subscribed}
              onChange={(_, checked) => onSwitch(item, checked)}
            ></Switch>
          </div>
        )
      })}
    </div>
  )
}
