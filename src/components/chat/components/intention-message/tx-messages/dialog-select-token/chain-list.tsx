import clsx from 'clsx'

import { Avatar } from '@mui/material'
import { t } from 'i18next'
import { ChainInfo } from '@/api/chat/types'

interface Props {
  selectChainId: string
  tokenChain: ChainInfo[]
  setSelectChainId: (v: string) => void
}

export const ChainList = ({
  tokenChain,
  selectChainId,
  setSelectChainId,
}: Props) => {
  return (
    <div className="mt-4 px-6 flex overflow-x-auto max-w-[450px]">
      <Avatar
        className={clsx(
          '!w-[35px] !h-[35px] mr-2 !bg-black cursor-pointer border-[3px]',
          selectChainId === '-1' ? '!border-blue-700' : '!border-white'
        )}
        onClick={() => setSelectChainId('-1')}
      >
        <span className="!text-sm">{t('all')}</span>
      </Avatar>
      {tokenChain.map((chain, i) => {
        return (
          <img
            src={chain.logo}
            className={clsx(
              'cursor-pointer w-[35px] h-[35px] rounded-lg object-cover border-[3px]',
              chain.id == selectChainId ? 'border-blue-700' : 'border-white',
              tokenChain.length - 1 !== i ? 'mr-2' : ''
            )}
            onClick={() => setSelectChainId(chain.id)}
          />
        )
      })}
    </div>
  )
}
