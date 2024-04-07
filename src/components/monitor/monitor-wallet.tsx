import { Button, CircularProgress, OutlinedInput } from '@mui/material'
import { IoEyeOutline } from 'react-icons/io5'
import { useTranslation } from 'react-i18next'

import type { MonitorConfigData } from '@/api/monitor/type'
import { useState } from 'react'
import { useMonitorStore } from '@/stores/use-monitor-store'
import { MonitorConfig } from '@/config/monitor'
import toast from 'react-hot-toast'

interface Props {
  data?: MonitorConfigData
}

export const MonitorWallet = ({ data }: Props) => {
  const { t } = useTranslation()
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const { configData, setConfig } = useMonitorStore()

  const addressList = configData?.trade?.content ?? []

  const handlePaste = async () => {
    const clipboardData = navigator.clipboard
    const pastedText = await clipboardData?.readText()
    setAddress(pastedText)
  }

  const onWatch = () => {
    //  || !isAddress(address)
    if (!address.trim()) {
      toast.error(t('address.invaild'))
      return
    }

    setLoading(true)
    setConfig({
      message_type: MonitorConfig.trade,
      content: [...addressList, address],
    }).finally(() => {
      setLoading(false)
    })
  }

  return (
    <div className=" px-10 pt-2 pb-10 max-sm:px-6 max-sm:pt-2 max-sm:pb-6 mx-auto">
      <div className="">{t('monitor.wallet.text')}</div>
      <div className="my-4">
        <OutlinedInput
          value={address}
          size="small"
          fullWidth
          endAdornment={
            <span
              className="cursor-pointer text-blue-500 text-nowrap"
              onClick={handlePaste}
            >
              {t('paste')}
            </span>
          }
          onChange={(e) => setAddress(e.target.value)}
        />
        <Button
          variant="contained"
          className="!mt-5 !rounded-full "
          disableElevation
          onClick={onWatch}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={16}></CircularProgress>
          ) : (
            <IoEyeOutline size={20} />
          )}

          <span className="ml-2">{t('track')}</span>
        </Button>
      </div>
      <div className="text-[#02101088] text-sx">
        <div>{t('monitor.wallet.text1')}</div>
        <div>{t('monitor.wallet.text2')}</div>
        <div>{t('monitor.wallet.text3')}</div>
      </div>

      {addressList.length !== 0 ? (
        <>
          <div className="mt-4 font-bold">{t('monitor.address.list')}</div>

          {addressList.map((address) => (
            <div className="mt-2">{address}</div>
          ))}
        </>
      ) : null}
    </div>
  )
}
