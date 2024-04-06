import { useShow } from '@/hooks/use-show'
import { Button, Dialog, OutlinedInput, Switch } from '@mui/material'
import { IoSettingsOutline } from 'react-icons/io5'
import { DialogHeader } from '../dialog-header'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { FaChevronLeft, FaCheck } from 'react-icons/fa6'
import { useResponsive } from '@/hooks/use-responsive'
import { MonitorLabelSwitch } from './monitor-label-switch'
import { MonitorConfigData } from '@/api/monitor/type'

interface Props {
  data?: MonitorConfigData
}

export const MonitorPools = ({ data }: Props) => {
  const { t } = useTranslation()
  const [chain, setChain] = useState()
  const { show, open, hidden } = useShow(true)
  const { isMobile } = useResponsive()
  const chains = [
    {
      logo: '/images/monitor/monitor.png',
      name: 'Solana',
      setting: true,
      open: false,
    },
    {
      logo: '/images/monitor/monitor.png',
      name: 'Avanche',
      setting: false,
      open: false,
    },
    {
      logo: '/images/monitor/monitor.png',
      name: 'Ethereum',
      setting: false,
      open: false,
    },
    {
      logo: '/images/monitor/monitor.png',
      name: 'Blast',
      setting: false,
      open: false,
    },
    {
      logo: '/images/monitor/monitor.png',
      name: 'Blast',
      setting: false,
      open: false,
    },
    {
      logo: '/images/monitor/monitor.png',
      name: 'Blast',
      setting: false,
      open: false,
    },
    {
      logo: '/images/monitor/monitor.png',
      name: 'Blast',
      setting: false,
      open: false,
    },
    {
      logo: '/images/monitor/monitor.png',
      name: 'Blast',
      setting: false,
      open: false,
    },
    {
      logo: '/images/monitor/monitor.png',
      name: 'Blast',
      setting: false,
      open: false,
    },
    {
      logo: '/images/monitor/monitor.png',
      name: 'Blast',
      setting: false,
      open: false,
    },
    {
      logo: '/images/monitor/monitor.png',
      name: 'Blast',
      setting: false,
      open: false,
    },
    {
      logo: '/images/monitor/monitor.png',
      name: 'Blast',
      setting: false,
      open: false,
    },
  ]

  const openSetting = (chain: any) => {
    open()
    setChain(chain)
  }

  const onApply = () => {
    hidden()
  }

  return (
    <div className="px-10 pb-6 max-sm:px-6 grid grid-cols-2 gap-y-2 gap-x-4 max-sm:grid-cols-1">
      {chains.map((chain) => {
        return (
          <MonitorLabelSwitch
            key={chain.name}
            data={chain}
            onSwitch={openSetting}
          ></MonitorLabelSwitch>
        )
      })}
      <Dialog open={show} onClose={hidden}>
        <DialogHeader
          text={
            <div
              className={`flex justify-center items-center max-sm:min-w-[80vw] ${
                isMobile ? 'relative left-[-18px]' : ''
              }`}
            >
              <img
                src={'/images/monitor/monitor.png'}
                alt="Logo"
                width={20}
                height={20}
              />
              <span className="ml-2">
                {t('pools.config.header').replace('$1', 'Solana')}
              </span>
            </div>
          }
          onBack={hidden}
          onClose={hidden}
          showCloseBtn={!isMobile}
        ></DialogHeader>
        <div className="min-w-[400px] max-sm:min-w-[100px] max-sm:px-6">
          <div className="text-center mb-6 font-bold">
            {t('pools.config.text1')}
          </div>
          <div className="flex my-2 justify-center items-center max-sm:flex-col max-sm:items-start">
            <div className="mr-4">{t('pools.config.text2')}</div>
            <OutlinedInput
              placeholder="1000"
              size="small"
              fullWidth={isMobile}
              startAdornment={<span className="opacity-45 mr-2">$</span>}
            ></OutlinedInput>
          </div>
          <div className="flex my-2 justify-center items-center max-sm:flex-col max-sm:items-start">
            <div className="mr-4">{t('pools.config.text3')}</div>
            <OutlinedInput
              placeholder=""
              size="small"
              fullWidth={isMobile}
              startAdornment={<span className="opacity-45 mr-2">$</span>}
            ></OutlinedInput>
          </div>
        </div>
        <div className="flex justify-center pt-5 pb-8 max-sm:pt-3 max-sm:pb-4">
          <Button
            variant="outlined"
            color="inherit"
            className="!items-center !rounded-full w-[120px] max-sm:w-[100px]"
            size={isMobile ? 'small' : 'medium'}
            onClick={hidden}
          >
            <FaChevronLeft size={15}></FaChevronLeft>
            <span className="ml-2">{t('go.back')}</span>
          </Button>
          <Button
            variant="contained"
            size={isMobile ? 'small' : 'medium'}
            className="!rounded-full !ml-5 w-[120px] max-sm:w-[100px]"
            onClick={onApply}
          >
            <FaCheck></FaCheck>
            <span className="ml-2">{t('apply')}</span>
          </Button>
        </div>
      </Dialog>
    </div>
  )
}
