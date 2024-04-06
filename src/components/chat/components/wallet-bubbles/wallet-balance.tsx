import {
  ChatResponseAnswerMeta,
  ChatResponseMetaBalance,
} from '@/api/chat/types'
import MessageBubble from '../bubbles/message-bubble'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { utilFmt } from '@/utils/format'

interface Props {
  msg: ChatResponseAnswerMeta
}

export const WalletBalance = (props: Props) => {
  const { msg } = props
  const { t } = useTranslation()

  const balances = [
    {
      symbol: 'QQQ', // 代币简称
      name: 'QAQAASADAS', // 代币名
      mintAddress: '2Whhi93Ckub7Sc9DViCLTpKS4bdDy9zv3ctxEJAa7J6D', // 铸造者
      amount: '10000', // 持有量
      priceUsd: '100$', // 代币价格
      valueUsd: 1000, // 价值
      logoUrl: 'https://fanyi.youdao.com/img/fanyi.a74f19d1.png', // 头像
    },
    {
      symbol: 'QQQ', // 代币简称
      name: 'QAQA', // 代币名
      mintAddress: '2Whhi93Ckub7Sc9DViCLTpKS4bdDy9zv3ctxEJAa7J6D', // 铸造者
      amount: '10000', // 持有量
      priceUsd: '100$', // 代币价格
      valueUsd: 1000, // 价值
      logoUrl: 'https://fanyi.youdao.com/img/fanyi.a74f19d1.png', // 头像
    },
  ]

  if (!balances.length) {
    return <MessageBubble>{t('no.balance')}</MessageBubble>
  }

  const msgData = msg.data as unknown as ChatResponseMetaBalance

  const getTotalUValue = () => {
    return balances.reduce((value, next) => {
      return value + next.valueUsd
    }, 0)
  }

  return (
    <MessageBubble className="!px-0">
      <div className="pb-2 px-4 text-primary">
        {t('wallet')}
        <span className="ml-2">{utilFmt.addr(msgData.address)}</span>
        <span className="ml-2 text-black font-bold">{getTotalUValue()}$</span>
      </div>
      <div className="">
        {balances?.map((token, i) => {
          return (
            <div
              key={i}
              className={clsx(
                'grid grid-cols-[80px_auto_80px] gap-x-2 py-1 pl-4 pr-10',
                `${i !== balances.length - 1 ? 'border-b border-gray-300' : ''}`
              )}
            >
              <div className="text-primary truncate">{token.name}</div>
              <div>{token.priceUsd}</div>
              <div className='ml-2'>{token.amount}</div>
            </div>
          )
        })}
      </div>
    </MessageBubble>
  )
}
