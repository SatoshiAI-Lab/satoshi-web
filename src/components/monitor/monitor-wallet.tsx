import { Button, CircularProgress, OutlinedInput } from '@mui/material'
import { IoCopyOutline, IoEyeOutline } from 'react-icons/io5'
import { useTranslation } from 'react-i18next'

import type { MonitorConfigData } from '@/api/monitor/type'
import { useState } from 'react'
import { useMonitorStore } from '@/stores/use-monitor-store'
import { MonitorConfig } from '@/config/monitor'
import toast from 'react-hot-toast'
import { utilFmt } from '@/utils/format'
import clsx from 'clsx'
import CopyToClipboard from 'react-copy-to-clipboard'

interface Props {
  data?: MonitorConfigData
}

export const MonitorWallet = ({ data }: Props) => {
  const { t } = useTranslation()
  const [address, setAddress] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const { configData, setConfig } = useMonitorStore()
  const [validateError, setValidateError] = useState<string[]>([])

  const addressList = configData?.trade?.content ?? []

  const handlePaste = async () => {
    const clipboardData = navigator.clipboard
    const pastedText = await clipboardData?.readText()
    setAddress(pastedText)
  }

  const checkForm = () => {
    const error = []
    if (!address.trim() || address.length != 44) {
      error.push(t('address.invaild'))
    }

    const isSome = addressList.some((item) => item.address == address)

    if (isSome) {
      error.push(t('address.invaild1'))
    }
    if (name.length > 16) {
      error.push(t('name.invaild'))
    }
    setValidateError(error)
    return error.length == 0
  }

  const onWatch = () => {
    //  || !isAddress(address)

    if (!checkForm()) return

    addressList.unshift({
      address,
      name: name || address.slice(-4),
      chain: 'SOL',
    })

    setLoading(true)
    setConfig({
      message_type: MonitorConfig.trade,
      content: addressList,
    })
      .then(() => {
        toast.success(t('monitor.successful'))
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className="max-w-[500px] px-10 pt-2 pb-4 max-sm:px-6 max-sm:pt-2 max-sm:pb-6 mx-auto">
      <div className="">{t('monitor.wallet.text')}*</div>
      <div className="mt-2 mb-4 flex flex-col items-start">
        <OutlinedInput
          value={address}
          size="small"
          fullWidth
          placeholder={t('monitor.wallet.placeholder')}
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
        <div className="mt-4 mb-2">{t('monitor.wallet.name')}</div>
        <OutlinedInput
          value={name}
          size="small"
          placeholder={t('monitor.wallet.name.placeholder')}
          className="!max-w-[150px]"
          onChange={(e) => setName(e.target.value)}
        />
        {validateError.map((msg) => {
          return <div className="mt-4 -mb-2 text-sm text-green-600">{msg}</div>
        })}

        <Button
          variant="contained"
          className="!mt-5 !py-2 !rounded-full "
          disableElevation
          onClick={onWatch}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={16}></CircularProgress>
          ) : (
            <IoEyeOutline size={20} />
          )}

          <span className="ml-2 leading-none">{t('track')}</span>
        </Button>
      </div>
      <div className="text-[#02101088] text-sx">
        <div>{t('monitor.wallet.text1')}</div>
        <div>{t('monitor.wallet.text2')}</div>
        <div>{t('monitor.wallet.text3')}</div>
      </div>

      {addressList.length !== 0 ? (
        <>
          <div className="mt-5 font-bold">{t('monitor.address.list')}</div>
          <div className="grid grid-cols-[80px_auto] mt-2 font-bold">
            <span>名字</span>
            <span>地址</span>
          </div>
          {addressList.map((data, i) => (
            <div
              className={clsx(
                'grid grid-cols-[80px_auto] py-2 border-t',
                i === addressList.length - 1 ? '!pb-0' : '',
                i === 0 ? '!mt-2' : ''
              )}
            >
              <span className="text-">{data.name}</span>
              <CopyToClipboard
                text={data.address}
                onCopy={() => toast.success(t('copy-success'))}
              >
                <span className="flex items-center text-gray-500 hover:text-gray-700 cursor-pointer">
                  {utilFmt.addr(data.address)}
                  <IoCopyOutline className="ml-1"></IoCopyOutline>
                </span>
              </CopyToClipboard>
            </div>
          ))}
        </>
      ) : null}
    </div>
  )
}
