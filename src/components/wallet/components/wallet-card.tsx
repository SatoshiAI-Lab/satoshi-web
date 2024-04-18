import React from 'react'
import { Button, IconButton, Tooltip } from '@mui/material'
import { IoTrash } from 'react-icons/io5'
import numeral from 'numeral'
import { useTranslation } from 'react-i18next'
import { t } from 'i18next'

import { utilFmt } from '@/utils/format'
import { WalletPlatform } from '@/config/wallet'
import { URL_CONFIG } from '@/config/url'

import type { WalletCardProps as WalletRrops } from '@/stores/use-wallet-store'
import type { WalletCardProps } from '../types'

interface Props extends WalletCardProps {
  wallet: WalletRrops
}

export const WalletCard = (props: Props) => {
  const { wallet, exportKey, renameWallet, copyAddress, deleteWallet } = props
  const { name, value, address, platform, tokens } = wallet
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

  return (
    <div className="relative border border-black rounded-[6px] px-[30px] py-[17px] flex justify-between items-center">
      <div>
        <div className="flex gap-2 items-center">
          <div className="text-[#0F40F5] text-[22px]">{name}</div>
          <div className="flex">
            <ChainLogos wallet={wallet} />
          </div>
        </div>
        <div className="text-[#101010b2]">{utilFmt.addr(address, 4)}</div>
        <div className="flex gap-8">
          <div>
            {t('balance')} ${numeral(value).format('0a')}
          </div>
          {tokens?.length && (
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
            className="!border-gray-400 hover:!bg-gray-100"
            onClick={() => item.onClick(address!)}
          >
            {item.title}
          </Button>
        ))}
      </div>
      <IconButton
        classes={{
          root: '!absolute !w-[30px] !h-[30px] right-2 top-2',
        }}
        onClick={() => deleteWallet(address!)}
      >
        <IoTrash size={30} />
      </IconButton>
    </div>
  )
}

const ChainLogos = (props: Pick<Props, 'wallet'>) => {
  const { chain, platform } = props.wallet
  const baseUrl = URL_CONFIG.cdn
  const evmLogos = [
    {
      src: chain?.logo,
      tooltip: 'Ethereum(ETH)',
    },
    {
      src: `${baseUrl}/chains/logo/BSC.png`,
      tooltip: 'Binance Smart Chain(BSC)',
    },
    {
      src: `${baseUrl}/chains/logo/Optimism.png`,
      tooltip: 'Optimism(OP)',
    },
    {
      src: `${baseUrl}/chains/logo/Arbitrum.png`,
      tooltip: 'Arbitrum(ARB)',
    },
  ]

  // EVM compatibility chain.
  if (platform === WalletPlatform.EVM) {
    return (
      <>
        {evmLogos.map((e, i) => (
          <Tooltip title={e.tooltip}>
            <img
              key={i}
              src={e.src}
              width={24}
              height={24}
              alt="Logo"
              className="mr-1"
            />
          </Tooltip>
        ))}
        <Tooltip title={t('evm-all-chain')}>
          <span>...</span>
        </Tooltip>
      </>
    )
  }

  return (
    <Tooltip title="Solana(SOL)">
      <img src={chain?.logo ?? ''} width={24} height={24} alt="Logo" />
    </Tooltip>
  )
}

export default WalletCard
