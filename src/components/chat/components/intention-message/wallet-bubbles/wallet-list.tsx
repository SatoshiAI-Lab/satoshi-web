import { IconButton, Radio, Skeleton } from '@mui/material'
import clsx from 'clsx'
import numeral from 'numeral'
import CopyToClipboard from 'react-copy-to-clipboard'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { useQuery } from '@tanstack/react-query'

import { UserCreateWalletResp } from '@/api/wallet/params'
import { CHAT_CONFIG } from '@/config/chat'
import { useChat } from '@/hooks/use-chat'
import { utilFmt } from '@/utils/format'
import { useWallet } from '@/hooks/use-wallet'
import { walletApi } from '@/api/wallet'
import { CustomSuspense } from '@/components/custom-suspense'

import type {
  ChatResponseWalletList,
  ChatResponseWalletListToken,
} from '@/api/chat/types'

interface Props {
  type: string
  chain: string
}

const gridCls = 'grid grid-cols-[175px_130px_130px_100px]'

export const WalletList = (props: Props) => {
  const { type, chain } = props
  const { t } = useTranslation()
  const { addMessageAndLoading, sendMsg } = useChat()
  const {
    data: walletsData,
    isLoading,
    refetch: refetchWallets,
  } = useQuery({
    queryKey: [walletApi.getWallets.name + chain, chain],
    queryFn: () => walletApi.getWallets(chain),
  })

  const { removeWallet } = useWallet()
  const wallets = walletsData?.data ?? []
  const walletList = wallets.sort(
    (a, b) =>
      new Date(b.added_at ?? 0).getTime() - new Date(a.added_at ?? 0).getTime()
  )

  const { changeNameWalletList, deleteNameWalletList, exportWalletList } =
    CHAT_CONFIG.metadataType
  const isChange = type == changeNameWalletList
  const isDelete = type == deleteNameWalletList
  const isExport = type == exportWalletList

  const onRemoveWallet = async (id: string) => {
    const loadingId = toast.loading(t('deleting'))
    try {
      await removeWallet(id)
      await refetchWallets()
      toast.success(t('delete-success'))
    } catch (error) {
      toast.error(t('deleting-error'))
    } finally {
      toast.dismiss(loadingId)
    }
  }

  const handleSelect = (wallet: ChatResponseWalletList) => {
    let question = ''

    if (isChange) {
      question = t('changename.walllet')
    }

    if (isDelete) {
      onRemoveWallet(wallet.id)
      return
      // question = t('delete.wallet.intent.text')
    }

    if (isExport) {
      question = t('export.wallet.intent.text')
    }

    question = question.replace('$1', wallet.name)
    addMessageAndLoading({ msg: question, position: 'right' })

    sendMsg({ question })
    // onClickIcon?.(wallet)
    setTimeout(refetchWallets, 2000)
  }

  const getTokenBalance = (tokens?: ChatResponseWalletListToken[]) => {
    const balance = tokens?.reduce((cur, next) => {
      return cur + Number(next.valueUsd)
    }, 0)
    return numeral(balance).format('$0.00')
  }

  const getIcon = (item: UserCreateWalletResp) => {
    if (isDelete) {
      return (
        <IconButton
          onClick={() => handleSelect(item)}
          size="small"
          className="!p-2"
        >
          <RiDeleteBin5Line />
        </IconButton>
      )
    }

    return (
      <Radio
        name={item.chain?.name}
        onClick={() => handleSelect(item)}
        size="small"
      />
    )
  }

  const WalletBody = () => {
    if (walletList?.length == 0) {
      return <div>{t('wallet.list.empty')}</div>
    }
    return (
      <div className="max-h-[260px] overflow-y-scroll">
        {walletList?.map((item) => {
          return (
            <div
              key={item.id}
              className={clsx(
                gridCls,
                'min-w-[320px] text-black text-sm',
                'border-t border-gray-200'
              )}
            >
              <div className={clsx('flex items-center justify-start')}>
                <div className="ml-1 truncate">
                  {item.platform}_{item?.name}
                </div>
              </div>
              <div
                className={clsx(
                  'flex items-center text-gray-500 justify-start',
                  'hover:text-gray-600'
                )}
              >
                <CopyToClipboard
                  text={item.address ?? ''}
                  onCopy={() => toast.success(t('copy-success'))}
                >
                  <span className="text-nowrap cursor-pointer">
                    {utilFmt.addr(item.address ?? '')}
                  </span>
                </CopyToClipboard>
              </div>
              <div className="flex items-center text-gray-500 hover:text-gray-600 ml-5">
                <span className="text-nowrap">
                  {getTokenBalance(item.tokens)}
                </span>
              </div>
              <div className="text-nowrap text-center">
                {getIcon(item as UserCreateWalletResp)}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <>
      <div className={clsx(gridCls, 'min-w-[320px] pb-2')}>
        <div className="ml-1">{t('wallet.name')}</div>
        <div className="">{t('address')}</div>
        <div className="ml-5">{t('total.balance')}</div>
        <div className="text-center">{t('operation')}</div>
      </div>
      <CustomSuspense isPendding={isLoading} fallback={<WalletBodySkeleton />}>
        {WalletBody()}
      </CustomSuspense>
    </>
  )
}

const WalletBodySkeleton = () => {
  return Array.from({ length: 5 }).map((_, i) => (
    <Skeleton key={i} height={40} />
  ))
}

export default WalletList
