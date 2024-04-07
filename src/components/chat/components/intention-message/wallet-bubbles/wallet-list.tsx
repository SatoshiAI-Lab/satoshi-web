import {
  ChatResponseWalletList,
  ChatResponseWalletListToken,
} from '@/api/chat/types'
import { walletApi } from '@/api/wallet'
import { UserCreateWalletResp } from '@/api/wallet/params'
import { CHAT_CONFIG } from '@/config/chat'
import { useChat } from '@/hooks/use-chat'
import { utilFmt } from '@/utils/format'
import { IconButton, Radio } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import numeral from 'numeral'
import { useTranslation } from 'react-i18next'
import { RiDeleteBin5Line } from 'react-icons/ri'

interface Props {
  data: ChatResponseWalletList[]
  type: string
}

export const WalletList = (props: Props) => {
  const { type } = props
  const { t } = useTranslation()
  const { addMessageAndLoading, sendMsg } = useChat()

  const { data: result, refetch } = useQuery({
    queryKey: [],
    queryFn: () => walletApi.getWallets({ platform: 'SOL' }),
    refetchInterval: 15_000,
  })

  // const [active, setActive] = useState(false)
  const walletList = result?.data.sort(
    (a, b) => new Date(b.added_at).getTime() - new Date(a.added_at).getTime()
  )

  const { changeNameWalletList, deleteNameWalletList, exportWalletList } =
    CHAT_CONFIG.metadataType
  const isChange = type == changeNameWalletList
  const isDelete = type == deleteNameWalletList
  const isExport = type == exportWalletList
  const handleSelect = (wallet: ChatResponseWalletList) => {
    let question = ''

    if (isChange) {
      question = t('changename.walllet')
    }

    if (isDelete) {
      question = t('delete.wallet.intent.text')
    }

    if (isExport) {
      question = t('export.wallet.intent.text')
    }

    question = question.replace('$1', wallet.name)
    addMessageAndLoading({ msg: question, position: 'right' })

    sendMsg({
      question,
    })
    // onClickIcon?.(wallet)
    setTimeout(() => {
      refetch()
    }, 2000)
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
          <RiDeleteBin5Line></RiDeleteBin5Line>
        </IconButton>
      )
    }

    return <Radio onClick={() => handleSelect(item)} size="small" />
  }

  const getWalllet = () => {
    if (walletList?.length == 0) {
      return <div>{t('wallet.list.empty')}</div>
    }
    return (
      <div className="max-h-[260px] overflow-y-scroll">
        {walletList?.map((item, i) => {
          return (
            <div
              key={item.id}
              className={clsx(
                `grid grid-cols-[175px_120px_120px_50px]`,
                'min-w-[320px] text-black text-sm',
                'border-t border-gray-200'
              )}
            >
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

              <div className={clsx('flex items-center justify-start')}>
                <div className="ml-1 truncate">
                  {item.platform}_{item?.name}
                </div>
              </div>
              <div
                className={clsx(
                  'flex items-center text-gray-500 hover:text-gray-600 justify-start'
                )}
              >
                <span className="text-nowrap">
                  {utilFmt.addr(item.address)}
                </span>
              </div>
              <div className="flex items-center text-gray-500 hover:text-gray-600 ml-5">
                <span className="text-nowrap">
                  {getTokenBalance(item.tokens)}
                </span>
              </div>
              <div className="text-nowrap text-center">{getIcon(item)}</div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <>
      <div
        className={clsx(
          `grid grid-cols-[175px_120px_120px_50px]`,
          'min-w-[320px] pb-2'
        )}
      >
        {/* <div className="grid grid-cols-[15px_30px_auto_120px] min-w-[350px] pb-2"> */}
        {/* <div></div> */}
        <div className="ml-1">{t('wallet.name')}</div>
        <div className="">{t('address')}</div>
        <div className="ml-5">{t('total.balance')}</div>
        <div className="text-center">{t('operation')}</div>
      </div>
      {getWalllet()}
    </>
  )
}
