import React, {
  type ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import {
  useQuery,
  type QueryObserverResult,
  type RefetchOptions,
} from '@tanstack/react-query'
import { nanoid } from 'nanoid'

import type { GetWalletsRes, UserCreateWalletResp } from '@/api/wallet/params'
import type { FetcherResponse } from '@/api/fetcher/types'

import { MessageBubble } from './message-bubble'
import { ChainSelect } from '@/components/chain-select'
import { Chain, WALLET_CONFIG } from '@/config/wallet'
import { walletApi } from '@/api/wallet'
import { utilFmt } from '@/utils/format'

interface Props {
  title?: ReactNode
  disabled?: boolean
  onSelect?: (chain: Chain) => void
  onWalletClick?: (wallet: UserCreateWalletResp) => void
  onWalletsChange?: (wallets: UserCreateWalletResp[]) => void
  itemBuilder?: (wallet: UserCreateWalletResp) => ReactNode
}

export interface WalletSelectMessageExport {
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<FetcherResponse<GetWalletsRes>, Error>>
}

export const WalletSelectMessage = forwardRef((props: Props, ref) => {
  const {
    title,
    disabled,
    onSelect,
    onWalletClick,
    onWalletsChange,
    itemBuilder,
  } = props
  const { t } = useTranslation()
  const idRef = useRef('')
  const [chain, setChain] = useState(WALLET_CONFIG.defaultChain)

  const { data, isRefetching, refetch } = useQuery({
    queryKey: [walletApi.getWallets.name + idRef.current, chain],
    queryFn: () => walletApi.getWallets(chain),
  })
  const wallets = data?.data[chain] ?? []

  useEffect(() => {
    idRef.current = nanoid()
  }, [])

  useEffect(() => {
    onWalletsChange?.(wallets)
  }, [wallets])

  useImperativeHandle(ref, () => ({ refetch } as WalletSelectMessageExport), [])

  return (
    <MessageBubble>
      {title}
      <ChainSelect
        value={chain}
        onSelect={(c) => {
          onSelect?.(c as Chain)
          setChain(c as Chain)
        }}
        avatarSize={18}
        classes={{ select: '!flex !items-center !py-2 !text-sm' }}
        disabled={disabled || isRefetching}
      />
      <ul className="flex flex-col">
        {wallets.map((w) => (
          <li key={w.id} className="mt-2 last:mb-1">
            {itemBuilder ? (
              itemBuilder(w)
            ) : (
              <Button
                variant="outlined"
                size="small"
                className="!flex-col !w-full !items-start"
                disabled={disabled || isRefetching}
                onClick={() => onWalletClick?.(w)}
              >
                <span>
                  {t('name')}: {w.name}
                </span>
                <span>
                  {t('address')}: {utilFmt.addr(w.address)}
                </span>
                <span>
                  {t('balance')}: ${w.value}
                </span>
              </Button>
            )}
          </li>
        ))}
      </ul>
    </MessageBubble>
  )
})

export default WalletSelectMessage
