import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaChevronLeft, FaCheck } from 'react-icons/fa6'
import { Button, Dialog, OutlinedInput, Switch } from '@mui/material'
import clsx from 'clsx'

import { useShow } from '@/hooks/use-show'
import { DialogHeader } from '../dialog-header'
import { useResponsive } from '@/hooks/use-responsive'
import { MonitorLabelSwitch } from './monitor-label-switch'

import type { MonitorConfigData, PoolData } from '@/api/monitor/type'
import { useMonitorStore } from '@/stores/use-monitor-store'
import { MonitorConfig } from '@/config/monitor'
import toast from 'react-hot-toast'

interface Props {
  data?: MonitorConfigData
  className?: string
}

const defaultMin = 1000
const defaultMax = 1000000

export const MonitorPools = ({ data, className }: Props) => {
  const { t } = useTranslation()
  const [chain, setChain] = useState<PoolData>()
  const { show, open, hidden } = useShow(false)
  const { isMobile } = useResponsive()
  const { configData, setConfig } = useMonitorStore()
  const [min, setMin] = useState(defaultMin)
  const [max, setMax] = useState(defaultMax)
  const [loading, setLoading] = useState<string>()

  const chains = configData?.pool.content || []

  const onSwitch = async (checked: boolean, data: PoolData) => {
    data.subscribed = checked

    const content =
      configData?.pool.content
        .filter((item) => item.subscribed)
        .map((item) => {
          return {
            min: item.chain == chain?.chain ? min ?? defaultMin : chain?.min,
            max: item.chain == chain?.chain ? max ?? defaultMax : chain?.max,
            chain: item.chain,
          }
        }) || []
    try {
      setLoading(data.chain)
      await setConfig({
        message_type: MonitorConfig.pool,
        content: [...content],
      })
    } catch {
    } finally {
      setLoading(undefined)
    }
  }

  const handleAll = async (checked: boolean) => {
    const list = checked
      ? configData?.pool.content.map((item) => {
          return {
            min: item?.min ?? defaultMin,
            max: item?.max ?? defaultMax,
            chain: item.chain,
          }
        })
      : []
    try {
      setLoading('chain')
      await setConfig({
        message_type: MonitorConfig.pool,
        content: list,
      })
    } catch {
    } finally {
      setLoading(undefined)
    }
  }

  const openSetting = (chain: PoolData) => {
    setChain(chain)
    setMin(chain.min || defaultMin)
    setMax(chain.max || defaultMax)
    open()
  }

  const onApply = () => {
    if (min > max) {
      toast.error(t('pools.config.error'))
      return
    }

    onSwitch(true, chain!)
    hidden()
  }

  return (
    <>
      <div className={clsx('mb-2 flex items-center px-10', className)}>
        {t('all.on.or.off')}
        <Switch
          checked={!chains?.some((item) => !item.subscribed)}
          disabled={!!loading}
          onChange={(_, checked) => handleAll(checked)}
        ></Switch>
      </div>
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
              disabled={!!loading}
              onSetting={chain.subscribed ? openSetting : null}
              logo={
                chain.logo ??
                `https://img.mysatoshi.ai/chains/logo/${chain?.chain}.png`
              }
            ></MonitorLabelSwitch>
          )
        })}
        {chain?.subscribed && (
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
                    src={
                      chain?.logo ??
                      `https://img.mysatoshi.ai/chains/logo/${chain?.chain}.png`
                    }
                    alt="Logo"
                    width={26}
                    height={26}
                    className="w-[26px] h-[26px] -mt-[2px]"
                  />
                  <span className="ml-2">
                    {t('pools.config.header').replace('$1', chain?.chain!)}
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
                  value={min}
                  fullWidth={isMobile}
                  type="number"
                  startAdornment={<span className="opacity-45 mr-2">$</span>}
                  onChange={(e) => setMin(Number(e.target.value))}
                ></OutlinedInput>
              </div>
              <div className="flex my-2 justify-center items-center max-sm:flex-col max-sm:items-start">
                <div className="mr-4">{t('pools.config.text3')}</div>
                <OutlinedInput
                  placeholder=""
                  size="small"
                  type="number"
                  value={max}
                  fullWidth={isMobile}
                  startAdornment={<span className="opacity-45 mr-2">$</span>}
                  onChange={(e) => setMax(Number(e.target.value))}
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
        )}
      </div>
    </>
  )
}
