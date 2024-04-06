import { ChatResponseWalletList } from '@/api/chat/types'
import { utilFmt } from '@/utils/format'
import { Radio } from '@mui/material'
import clsx from 'clsx'
import { useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { IoCopyOutline } from 'react-icons/io5'

interface Props {
  data: ChatResponseWalletList[]
  isSelect?: boolean
  onClickItem?: (wallet: ChatResponseWalletList) => void
}

export const WalletList = ({ data, isSelect, onClickItem }: Props) => {
  const { t } = useTranslation()
  const [active, setActive] = useState(false)

  const getCols = () => {
    if (isSelect) {
      return 'grid-cols-[50px_175px_120px]'
    }
    return 'grid-cols-[25px_175px_120px] py-2'
  }

  const handleSelect = () => {
    if (!active) {
      setActive(true)
    }
  }

  return (
    <div className="max-h-[260px] overflow-y-scroll">
      <div className={clsx(`grid ${getCols()}`, 'min-w-[320px] pb-2')}>
        {/* <div className="grid grid-cols-[15px_30px_auto_120px] min-w-[350px] pb-2"> */}
        <div className=""></div>
        {/* <div></div> */}
        <div className="ml-1">{t('wallet.name')}</div>
        <div className="text-right ml-2">{t('address')}</div>
      </div>
      {data?.map((item, i) => {
        return (
          <div
            key={item.id}
            className={clsx(
              `grid ${getCols()}`,
              'min-w-[320px] text-black text-sm',
              'border-t border-gray-200'
            )}
            onClick={() => onClickItem?.(item)}
          >
            <div className="text-nowrap text-center">
              {isSelect ? (
                <Radio onClick={handleSelect} disabled={active} size='small' />
              ) : (
                i + 1
              )}
            </div>
            {/*<div className="">
                   <img
                    src={
                      item.platform == 'SOL'
                        ? '/images/chain-logo/Solana.png'
                        : '/images/monitor/monitor.png'
                    }
                    alt="Logo"
                    width={20}
                    height={20}
                    className="mx-auto"
                  /> 
                </div>*/}

            <CopyToClipboard
              text={item.name}
              onCopy={() => toast.success(t('wallet.copy-name.success'))}
            >
              <div className="flex items-center cursor-pointer justify-start">
                <div className="ml-1 truncate">
                  {item.platform}_{item?.name}
                </div>
                <IoCopyOutline className="mx-1 text-gray-500 hover:text-gray-600"></IoCopyOutline>
              </div>
            </CopyToClipboard>
            <CopyToClipboard
              text={item.address}
              onCopy={() => toast.success(t('wallet.copy-address.success'))}
            >
              <div className="flex items-center cursor-pointer text-gray-500 hover:text-gray-600 justify-end">
                <span className="text-nowrap">
                  {utilFmt.addr(item.address)}
                </span>
                <IoCopyOutline className="ml-1"></IoCopyOutline>
              </div>
            </CopyToClipboard>
          </div>
        )
      })}
    </div>
  )
}
