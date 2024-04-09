import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaChevronLeft, FaCheck } from 'react-icons/fa6'
import { Button, Dialog, OutlinedInput } from '@mui/material'
import clsx from 'clsx'

import { useShow } from '@/hooks/use-show'
import { DialogHeader } from '../dialog-header'
import { useResponsive } from '@/hooks/use-responsive'
import { MonitorLabelSwitch } from './monitor-label-switch'

import type { MonitorConfigData, PoolData } from '@/api/monitor/type'
import { useMonitorStore } from '@/stores/use-monitor-store'
import { MonitorConfig } from '@/config/monitor'

interface Props {
  data?: MonitorConfigData
  className?: string
}

const defaultMin = 100
const defaultMax = 1000000

export const MonitorPools = ({ data, className }: Props) => {
  const { t } = useTranslation()
  const [chain, setChain] = useState<PoolData>()
  const [min, setMin] = useState(defaultMin)
  const [max, setMax] = useState(defaultMax)
  const { show, open, hidden } = useShow(false)
  const { isMobile } = useResponsive()
  const { configData, setConfig } = useMonitorStore()

  const chains = configData?.pool.content || []

  const onSwitch = (checked: boolean, data: PoolData) => {
    data.subscribed = checked
    const content =
      configData?.pool.content
        .filter((item) => item.subscribed)
        .map((item) => ({
          min: chain?.min ?? defaultMin,
          max: chain?.max ?? defaultMax,
          chain: item.chain,
        })) || []

    setConfig({
      message_type: MonitorConfig.pool,
      content: [...content],
    })
  }

  const openSetting = (chain: PoolData) => {
    open()
    setChain(chain)
    setMin(chain.min || defaultMin)
    setMax(chain.max || defaultMax)
  }

  const onApply = () => {
    hidden()
  }

  return (
    <div
      className={clsx(
        'px-10 pb-6 grid grid-cols-2 gap-y-3 gap-x-4',
        'max-sm:grid-cols-1 max-sm:px-6',
        className
      )}
    >
      {chains.map((chain, i) => {
        return (
          <MonitorLabelSwitch
            key={i}
            data={chain}
            onSwitch={onSwitch}
            disabled={chain.chain !== 'Solana'}
            onSetting={chain.slug ? openSetting : null}
            logo={`https://img.mysatoshi.ai/chains/logo/${chain.chain}.png`}
          ></MonitorLabelSwitch>
        )
      })}
      <Dialog open={show} onClose={hidden}>
        <DialogHeader
          text={
            <div
              className={clsx(
                'flex justify-center items-center max-sm:min-w-[80vw]',
                isMobile ? 'relative left-[-18px]' : ''
              )}
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
