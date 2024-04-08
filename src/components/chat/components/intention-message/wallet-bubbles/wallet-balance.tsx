import {
  ChatResponseAnswerMeta,
  ChatResponseMetaBalance,
  ChatResponseWalletBalance,
} from '@/api/chat/types'
import MessageBubble from '../../bubbles/message-bubble'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { utilFmt } from '@/utils/format'
import numeral from 'numeral'
import { formatUnits } from 'viem'
import CopyToClipboard from 'react-copy-to-clipboard'
import toast from 'react-hot-toast'

interface Props {
  msg: ChatResponseAnswerMeta
}

export const WalletBalance = (props: Props) => {
  const { msg } = props
  const { t } = useTranslation()

  let { tokens } = (msg.data || {}) as unknown as ChatResponseWalletBalance

  if (!tokens?.length) {
    return <MessageBubble>{t('no.balance')}</MessageBubble>
  }

  tokens = tokens.filter((token) => {
    // if (token.name == null) return false;
    return (token.valueUsd ?? 0) >= 1
  })

  const msgData = msg.data as unknown as ChatResponseMetaBalance

  const getTotalUValue = () => {
    return numeral(
      tokens.reduce((value, next) => {
        return value + (next?.valueUsd ?? 0)
      }, 0)
    ).format('0,0.0')
  }

  return (
    <MessageBubble className="!px-0">
      <div className="pb-2 px-4 text-primary">
        {t('wallet')}
        <CopyToClipboard
          text={msgData.address}
          onCopy={() => toast.success(t('copy-success'))}
        >
          <span className="ml-2 cursor-pointer">
            {utilFmt.addr(msgData.address)}
          </span>
        </CopyToClipboard>
        <span className="ml-2 text-black font-bold">{getTotalUValue()}$</span>
      </div>
      <div className="">
        {tokens?.map((token, i) => {
          // if (!token.name) return <></>
          return (
            <div
              key={i}
              className={clsx(
                'grid grid-cols-[60px_auto_80px] gap-x-4 py-2 pl-4 pr-10',
                `${
                  i !== tokens.length - 1 ? 'border-b border-gray-300' : '!pb-0'
                }`
              )}
            >
              <div className="text-primary truncate">{token.symbol || 'null'}</div>
              <div>${numeral(token.valueUsd).format('0,0.0')}</div>
              <div className="ml-2">
                {numeral(
                  formatUnits(BigInt(token.amount!), token.decimals!)
                ).format('0a.00')}
              </div>
            </div>
          )
        })}
      </div>
    </MessageBubble>
  )
}
