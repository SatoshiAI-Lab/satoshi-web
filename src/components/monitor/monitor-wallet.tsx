import { useState } from 'react'
import toast from 'react-hot-toast'
import { Button, CircularProgress, Dialog, OutlinedInput } from '@mui/material'
import { IoEyeOutline } from 'react-icons/io5'
import { useTranslation } from 'react-i18next'

import type { MonitorConfigData } from '@/api/monitor/type'

import { useMonitorStore } from '@/stores/use-monitor-store'
import { MonitorConfig } from '@/config/monitor'
import { DialogHeader } from '../dialog-header'
import { useShow } from '@/hooks/use-show'
import { MonitorWalletList } from './monitor-wallet-list'

interface Props {
  data?: MonitorConfigData
}

export const MonitorWallet = ({ data }: Props) => {
  const [address, setAddress] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [validateError, setValidateError] = useState<string[]>([])
  // const [selectedChain, setSelectedChain] = useState<string>(op)

  const { t } = useTranslation()
  const { configData, setConfig } = useMonitorStore()
  const { show, open, hidden } = useShow()

  const addressList = configData?.trade?.content ?? []

  const handlePaste = async () => {
    const clipboardData = navigator.clipboard
    const pastedText = await clipboardData?.readText()
    setAddress(pastedText)
  }

  const checkForm = () => {
    const error = []
    if (!address.trim()) {
      error.push(t('address.invaild'))
    }

    // if (selectedChain === op && !isAddress(address)) {
    //   error.push(t('address.invaild'))
    // }

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
      // chain: selectedChain,
    })

    setLoading(true)
    setConfig({
      message_type: MonitorConfig.Trade,
      content: addressList,
    })
      .then(() => {
        setName('')
        setAddress('')
        toast.success(t('monitor.successful'))
      })
      .catch(() => {
        toast.error(t('wallet.track.error'))
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
              className="cursor-pointer text-blue-500 text-nowrap ml-2"
              onClick={handlePaste}
            >
              {t('paste')}
            </span>
          }
          onChange={(e) => setAddress(e.target.value)}
        />
        <div className="flex items-center mt-4">
          <div className="mr-5">
            <div>{t('monitor.wallet.name')}</div>
            <OutlinedInput
              value={name}
              size="small"
              placeholder={t('monitor.wallet.name.placeholder')}
              className="!max-w-[150px] !mt-2"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {/* <div>
            <div className='mb-2'>{t('select-chain')}</div>
            <Select
              classes={{ select: '!flex !items-center' }}
              size="small"
              value={selectedChain}
              onChange={({ target }) => setSelectedChain(target.value)}
            >
              {monitorWalletSupperChain?.map((c, i) => (
                <MenuItem key={i} value={c.name}>
                  <Avatar src={c.logo} sx={{ width: 22, height: 22 }}>
                    {c.name}
                  </Avatar>
                  <div className="ml-2">{c.name}</div>
                </MenuItem>
              ))}
            </Select>
          </div> */}
        </div>
        {validateError.map((msg) => {
          return <div className="mt-4 -mb-2 text-sm text-green-600">{msg}</div>
        })}
        <Button
          variant="contained"
          className="!mt-5 !py-2 !rounded-full"
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
      <div className="text-sx">
        <div>{t('monitor.wallet.text1')}</div>
        <div>{t('monitor.wallet.text2')}</div>
        <div>{t('monitor.wallet.text3')}</div>
      </div>
      <div
        className="!mt-2 text-secondary underline cursor-pointer !rounded-full"
        onClick={open}
      >
        {t('trace.address.list')}
      </div>
      <Dialog open={show} onClose={hidden}>
        <DialogHeader text={t('trace.address.list')} onClose={hidden} />
        <MonitorWalletList />
      </Dialog>
    </div>
  )
}
