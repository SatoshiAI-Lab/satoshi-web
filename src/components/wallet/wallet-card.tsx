import { Button, IconButton } from '@mui/material'
import { FC } from 'react'
import { WalletCardProps } from './types'
import Image from 'next/image'
import { TfiClose } from 'react-icons/tfi'
import { BiTrash } from 'react-icons/bi'
import { IoTrash } from 'react-icons/io5'
import { t } from 'i18next'

const WalletCard: FC<WalletCardProps> = ({
  name,
  token,
  value,
  address,
  platform,
  exportKey,
  renameWallet,
  copyAddress,
  deleteWallet,
}) => {
  const handleWallet = [
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
            {platform === 'SOL' && (
              <Image
                src="/images/chain-logo/Solana.png"
                width={24}
                height={24}
                alt="solana"
              />
            )}
          </div>
        </div>
        <div className="text-[#101010b2]">
          {address!.replace(/^(.{4}).*(.{4})$/, '$1...$2')}
        </div>
        <div className="flex gap-8">
          <div>Balance $ {value}</div>
          {(token && <div>{token} tokens</div>) || <></>}
        </div>
      </div>
      <div className="flex gap-3">
        {handleWallet.map((item, index) => (
          <Button
            key={index}
            variant="outlined"
            classes={{
              root: '!text-black !rounded-full',
            }}
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
export { WalletCard }
