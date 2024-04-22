import { AddressData } from '@/api/monitor/type'
import { MonitorConfig } from '@/config/monitor'
import { useShow } from '@/hooks/use-show'
import { useMonitorStore } from '@/stores/use-monitor-store'
import { utilFmt } from '@/utils/format'
import { IconButton, CircularProgress } from '@mui/material'
import clsx from 'clsx'
import { useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { IoCopyOutline, IoCloseOutline } from 'react-icons/io5'

interface Props {
  className?: string
}

export const MonitorWalletList = ({ className }: Props) => {
  const { t } = useTranslation()
  const { configData, setConfig } = useMonitorStore()
  const addressList = configData?.trade?.content ?? []
  const [loading, setLoading] = useState<string>()

  const onRemove = (data: AddressData) => {
    const newAddressList = addressList.filter(
      (item) => item.address !== data.address
    )

    setLoading(`${data.address}`)
    setConfig({
      message_type: MonitorConfig.trade,
      content: newAddressList,
    })
      .then(() => {
        toast.success(t('remove.monitor.successful'))
      })
      .catch(() => {
        toast.error(t('remove.monitor.error'))
      })
      .finally(() => {
        setLoading('')
      })
  }

  return (
    <div className="px-10 pb-5 max-h-[300px] overflow-y-scroll">
      {addressList.length === 0 ? (
        <div className="text-center text-gray-500 my-5">
          {t('no.monitor.wallet')}
        </div>
      ) : (
        <div className={clsx('', className)}>
          <div className="grid grid-cols-[80px_150px_80px] mt-2 font-bold">
            <span>{t('name')}</span>
            <span>{t('address')}</span>
            <span className="text-center">{t('operation')}</span>
          </div>
          {addressList.map((data, i) => (
            <div
              className={clsx(
                'grid grid-cols-[80px_150px_80px] items-center py-1 border-t',
                i === addressList.length - 1 ? '!pb-0' : '',
                i === 0 ? '!mt-2' : ''
              )}
            >
              <span>{data.name}</span>
              <CopyToClipboard
                text={data.address}
                onCopy={() => toast.success(t('copy-success'))}
              >
                <span className="flex items-center text-gray-500 hover:text-gray-700 cursor-pointer">
                  {utilFmt.addr(data.address)}
                  <IoCopyOutline className="ml-1"></IoCopyOutline>
                </span>
              </CopyToClipboard>
              <div className="text-center">
                <IconButton onClick={() => onRemove(data)} disabled={!!loading}>
                  {loading == data.address ? (
                    <CircularProgress size={20} />
                  ) : (
                    <IoCloseOutline size={20} />
                  )}
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
