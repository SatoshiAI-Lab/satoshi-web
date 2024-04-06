import { useTranslation } from 'react-i18next'
import { MonitorLabelSwitch } from './monitor-label-switch'

export const MonitorEXInfo = () => {
  const { t } = useTranslation()

  const exList = [
    {
      name: 'Binance',
      logo: '/images/monitor/monitor.png',
    },
    {
      name: 'Binance',
      logo: '/images/monitor/monitor.png',
    },
    {
      name: 'Binance',
      logo: '/images/monitor/monitor.png',
    },
    {
      name: 'Binance',
      logo: '/images/monitor/monitor.png',
    },
    {
      name: 'Binance',
      logo: '/images/monitor/monitor.png',
    },
    {
      name: 'Binance',
      logo: '/images/monitor/monitor.png',
    },
    {
      name: 'Binance',
      logo: '/images/monitor/monitor.png',
    },
    {
      name: 'Binance',
      logo: '/images/monitor/monitor.png',
    },
  ]

  return (
    <div className="px-10 pb-7">
      <div className="grid grid-cols-2 gap-x-5 gap-y-4 max-sm:grid-cols-1">
        {exList.map((item, i) => {
          return <MonitorLabelSwitch key={i} data={item}></MonitorLabelSwitch>
        })}
      </div>
    </div>
  )
}
