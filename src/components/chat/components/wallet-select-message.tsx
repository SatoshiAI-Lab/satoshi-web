import React, {
  type ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { Button, Skeleton } from '@mui/material'
import { useTranslation } from 'react-i18next'
import {
  useQuery,
  type QueryObserverResult,
  type RefetchOptions,
} from '@tanstack/react-query'
import { nanoid } from 'nanoid'
import { clsx } from 'clsx'

import type { GetWalletsRes, UserCreateWalletResp } from '@/api/wallet/params'
import type { FetcherResponse } from '@/api/fetcher/types'

import { MessageBubble } from './message-bubble'
import { ChainSelect } from '@/components/chain-select'
import { Chain, WALLET_CONFIG } from '@/config/wallet'
import { walletApi } from '@/api/wallet'
import { CopyAddr } from '@/components/copy-addr'
import { CustomSuspense } from '@/components/custom-suspense'
import { ChatCase } from './chat-case'

interface Props {
  title?: ReactNode
  disabled?: boolean
  onSelect?: (chain: Chain) => void
  onWalletClick?: (wallet: UserCreateWalletResp) => void
  onWalletsChange?: (wallets: UserCreateWalletResp[]) => void
}

export interface WalletSelectMessageExport {
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<FetcherResponse<GetWalletsRes>, Error>>
}

export const WalletSelectMessage = forwardRef((props: Props, ref) => {
  const { title, disabled, onSelect, onWalletClick, onWalletsChange } = props
  const { t } = useTranslation()
  const idRef = useRef('')
  const [chain, setChain] = useState(WALLET_CONFIG.defaultChain)

  const { data, isFetching, isRefetching, refetch } = useQuery({
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
    <MessageBubble className="pb-3">
      {title}
      <ChainSelect
        value={chain}
        onSelect={(c) => {
          onSelect?.(c as Chain)
          setChain(c as Chain)
        }}
        avatarSize={18}
        classes={{
          select: '!flex !items-center !py-2 !text-sm',
          root: '!mt-1 !mb-2',
        }}
        disabled={disabled || isRefetching}
        showTitle={false}
      />
      <ul className={clsx('grid gap-2', wallets.length && 'grid-cols-2 ')}>
        <CustomSuspense
          isPendding={isFetching}
          fallback={
            <div className="grid grid-cols-2 gap-2">
              <WalletItemSkeleton />
            </div>
          }
          nullback={
            <div>
              <p>{t('wallet.null-hints').replace('{}', chain)}</p>
              <ChatCase text={t('wallet.null-case').replace('{}', chain)} />
            </div>
          }
        >
          {wallets.map((w) => (
            <li key={w.id}>
              {
                <Button
                  variant="outlined"
                  size="small"
                  className="!flex-col !w-full !items-start !text-sm"
                  disabled={disabled || isRefetching}
                  onClick={() => onWalletClick?.(w)}
                >
                  <span>
                    {t('name')}: <span className="font-bold">{w.name}</span>($
                    {w.value})
                  </span>
                  <CopyAddr
                    prefix={<span className="mr-1">{t('address')}:</span>}
                    iconSize={14}
                    addr={w.address}
                    onCopy={(e) => e.stopPropagation()}
                  />
                </Button>
              }
            </li>
          ))}
        </CustomSuspense>
      </ul>
    </MessageBubble>
  )
})

const WalletItemSkeleton = () => {
  return Array.from({ length: 4 }).map((_, i) => (
    <div
      key={i}
      className="h-[48px] border border-zinc-300 rounded px-2 py-1.5 flex flex-col justify-between"
    >
      <Skeleton variant="rounded" height={14} width={210} />
      <Skeleton variant="rounded" height={14} width={210} />
    </div>
  ))
}

export default WalletSelectMessage
