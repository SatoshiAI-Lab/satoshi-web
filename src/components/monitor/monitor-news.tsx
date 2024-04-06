import { Switch } from '@mui/material'
import { useTranslation } from 'react-i18next'

export const MonitorNews = () => {
  const { t } = useTranslation()

  return (
    <div className="px-10 pb-7 max-sm:px-6">
      <div className="relative left-[-8px] flex items-center">
        <Switch></Switch>
        <span>{t('monitor.news.text1').replace('$1', '关闭')}</span>
      </div>
      <div className="mt-3 text-[#02101088]">
        <span>{t('monitor.news.text2')}</span>
      </div>
    </div>
  )
}
