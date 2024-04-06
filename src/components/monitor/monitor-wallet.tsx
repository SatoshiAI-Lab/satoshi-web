import { Button, OutlinedInput } from '@mui/material'
import { IoEyeOutline } from 'react-icons/io5'
import { useTranslation } from 'react-i18next'
import { MonitorConfigData } from '@/api/monitor/type'

interface Props {
  data?: MonitorConfigData
}

export const MonitorWallet = ({ data }: Props) => {
  const { t } = useTranslation()

  return (
    <div className=" px-10 pt-2 pb-10 max-sm:px-6 max-sm:pt-2 max-sm:pb-6 mx-auto">
      <div className="">{t('monitor.wallet.text')}</div>
      <div className="my-4">
        <OutlinedInput
          size="small"
          fullWidth
          endAdornment={
            <span className="cursor-pointer text-blue-500 text-nowrap">
              {t('paste')}
            </span>
          }
        />
        <Button
          variant="contained"
          className="!mt-5 !rounded-full "
          disableElevation
        >
          <IoEyeOutline size={20} />
          <span className="ml-2">{t('track')}</span>
        </Button>
      </div>
      <div className="text-[#02101088] text-sx">
        <div>{t('monitor.wallet.text1')}</div>
        <div>{t('monitor.wallet.text2')}</div>
        <div>{t('monitor.wallet.text3')}</div>
      </div>
    </div>
  )
}
