import { Button, Switch } from '@mui/material'
import { useTranslation } from 'react-i18next'

export const MonitorTwitter = () => {
  const {t} = useTranslation()
  const xList = [
    {
      name: 'Elon Musk',
      url: '/images/monitor/monitor.png',
    },
    {
      name: 'Elon Musk',
      url: '/images/monitor/monitor.png',
    },
    {
      name: 'Elon Musk',
      url: '/images/monitor/monitor.png',
    },
    {
      name: 'Elon Musk',
      url: '/images/monitor/monitor.png',
    },
    {
      name: 'Elon Musk',
      url: '/images/monitor/monitor.png',
    },
  ]

  return (
    <div className="min-w-[500px] px-10 max-sm:px-6 max-sm:min-w-[auto]">
      <div className="max-w-[230px] flex flex-col max-sm:mx-auto">
        {xList.map((item, i) => {
          return (
            <div
              className={`max-w-[300px] flex justify-between pl-3 pr-2 border border-black rounded-lg ${
                i !== xList.length ? '!mb-4' : ''
              }`}
            >
              <div className="flex items-center">
                <img
                  key={item.name}
                  src={item.url}
                  alt="Logo"
                  width={20}
                  height={20}
                />
                <span className="ml-5">{item.name}</span>
              </div>
              <Switch></Switch>
            </div>
          )
        })}
      </div>
      <div className="mt-3 text-[#02101088] pb-6 text-wrap max-sm:pb-5">
        {t('monitor.twitter.text1')}
      </div>
    </div>
  )
}
