import { IconButton, Radio, Skeleton } from '@mui/material'
import { clsx } from 'clsx'
import numeral from 'numeral'
import CopyToClipboard from 'react-copy-to-clipboard'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { useQuery } from '@tanstack/react-query'

import type {
  ChatResponseWalletList,
  ChatResponseWalletListToken,
} from '@/api/chat/types'
import type { UserCreateWalletResp } from '@/api/wallet/params'

import { utilFmt } from '@/utils/format'
import { useWalletManage } from '@/hooks/use-wallet'
import { useChat } from '@/hooks/use-chat'
import { walletApi } from '@/api/wallet'
import { CustomSuspense } from '@/components/custom-suspense'
import { Chain } from '@/config/wallet'
import { useMessagesContext } from '@/contexts/messages'
import { utilWallet } from '@/utils/wallet'

const gridCls = 'grid grid-cols-[175px_130px_130px_100px]'

export const WalletList = (props: { chain: string }) => {
  const { chain } = props
  const { t } = useTranslation()
  const { sendChat } = useChat()
  const { metaType } = useMessagesContext()

  const {
    data: walletsData,
    isLoading,
    refetch: refetchWallets,
  } = useQuery({
    queryKey: [walletApi.getWallets.name + chain, chain],
    queryFn: () => walletApi.getWallets(chain),
  })

  const { removeWallet } = useWalletManage()
  const walletList = walletsData?.data[chain as Chain] ?? []

  const onRemoveWallet = async (id: string) => {
    const loadingId = toast.loading(t('wallet.deleting'))
    try {
      await removeWallet(id)
      await refetchWallets()
      toast.success(t('delete-success'))
    } catch (error) {
      toast.error(t('wallet.delete.failed'))
    } finally {
      toast.dismiss(loadingId)
    }
  }

  const handleSelect = (wallet: ChatResponseWalletList) => {
    let question = ''

    if (metaType.isWalletChange) {
      question = t('changename.walllet')
    }

    if (metaType.isWalletDelete) {
      onRemoveWallet(wallet.id)
      return
      // question = t('delete.wallet.intent.text')
    }

    if (metaType.isWalletExport) {
      question = t('export.wallet.intent.text')
    }

    question = question.replace('$1', wallet.name)

    // addMessageAndLoading({ msg: question, position: 'right' })
    sendChat({ question })
    // onClickIcon?.(wallet)
    setTimeout(refetchWallets, 2000)
  }

  const getTokenBalance = (tokens?: ChatResponseWalletListToken[]) => {
    const balance = tokens?.reduce((cur, next) => {
      return cur + Number(next.value_usd)
    }, 0)
    return numeral(balance).format('$0.00')
  }

  const getIcon = (item: UserCreateWalletResp) => {
    if (metaType.isWalletDelete) {
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
