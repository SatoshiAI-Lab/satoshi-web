import React from 'react'
import { Button, IconButton, Tooltip } from '@mui/material'
import { IoTrash } from 'react-icons/io5'
import numeral from 'numeral'
import { useTranslation } from 'react-i18next'
import { clsx } from 'clsx'

import type { WalletCardProps as WalletProps } from '@/stores/use-wallet-store'
import type { WalletCardProps } from '../types'

import { utilFmt } from '@/utils/format'
import { ChainLogos } from './chain-logos'

interface Props extends WalletCardProps {
  wallet: WalletProps
  latestWallet: WalletProps | undefined
}

export const WalletCard = (props: Props) => {
  const {
    wallet,
    latestWallet,
    exportKey,
    renameWallet,
    copyAddress,
    deleteWallet,
  } = props
  const { name, value, address, tokens } = wallet
  const { t } = useTranslation()
  const buttons = [
    {
      title: t('wallet.title.export-privatekey'),
      onClick: exportKey,
    },
    {
      title: t('wallet.title.rename-wallet'),
      onClick: renameWallet,
    },
    {
      title: t('wallet.title.copy-address'),
      onClick: copyAddress,
    },
  ]
  const isLatestCreated = latestWallet?.id === wallet?.id

  return (
    <div
      className={clsx(
        'relative border border-black rounded-md px-[30px] py-[17px]',
        'flex justify-between items-center transition-all dark:border-zinc-500',
        isLatestCreated && 'bg-gray-200 border-gray-300 dark:bg-zinc-800'
      )}
    >
      <div>
        <div className="flex gap-2 items-center">
          <Tooltip title={name}>
            <div className="text-primary text-xl max-w-[240px] truncate">
              {name}
            </div>
          </Tooltip>
          <div className="flex">
            <ChainLogos wallet={wallet} />
          </div>
        </div>
        <div className="text-black dark:text-gray-300">
          {utilFmt.addr(address, 4)}
        </div>
        <div className="flex gap-8">
          <div>
            {t('balance')} ${numeral(value).format('0a')}
          </div>
          {!!tokens?.length && (
            <div>
              {tokens?.length} {t('tokens').toLowerCase()}
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-3">
        {buttons.map((item, index) => (
          <Button
            key={index}
            variant="outlined"
            classes={{ root: '!text-black !rounded-full' }}
            className="!border-gray-400 hover:!bg-gray-100 dark:!text-gray-300 dark:hover:!bg-zinc-800"
            onClick={() => item.onClick(wallet!)}
          >
            {item.title}
          </Button>
        ))}
      </div>
      <IconButton
        classes={{
          root: '!absolute !w-[30px] !h-[30px] right-2 top-2',
        }}
        onClick={() => deleteWallet(wallet!)}
      >
        <IoTrash size={30} className="dark:text-white" />
      </IconButton>
    </div>
  )
}

export default WalletCard
