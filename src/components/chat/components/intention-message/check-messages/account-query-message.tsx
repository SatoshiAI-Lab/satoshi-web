import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import numeral from 'numeral'
import { clsx } from 'clsx'
import { isEmpty } from 'lodash'
import { Collapse, Tooltip } from '@mui/material'
import { IoIosArrowDown } from 'react-icons/io'

import type { AccountToken, QueryAddrRes } from '@/api/token/types'

import { utilFmt } from '@/utils/format'
import { MessageBubble } from '../../message-bubble'
import { useClipboard } from '@/hooks/use-clipboard'
import { Chain } from '@/config/wallet'

interface Props {
  accounts: QueryAddrRes['accounts']
  chain?: Chain
}

const EXPAND_NUM = 3

export const AccountQueryMessage = (props: Props) => {
  const { accounts, chain } = props
  const { t } = useTranslation()
  const { copy } = useClipboard()
  const [isExpand, setIsExpand] = useState(false)

  // If have the chain, only show this chain account.
  const entries = useMemo(() => {
    if (!chain) return accounts

    // If value is empty, use empty object.
    return accounts[chain] ? { [chain]: accounts[chain] } : {}
  }, [accounts, chain])

  if (isEmpty(entries)) {
    return <MessageBubble children={t('no.balance')} />
  }

  // Filter value >= 1 tokens.
  const filterTokens = (tokens: AccountToken[]) => {
    return tokens.filter((t) => Number(t.valueUsd) >= 1)
  }

  const TokenRow = (token: AccountToken, i: number) => {
    return (
      <div
        key={i}
        className={clsx(
          'grid grid-cols-[60px_auto_80px] gap-x-4 py-2 pl-4 pr-10',
          'border-b border-gray-300 last:border-b-0 first:pt-0'
        )}
      >
        <div className="text-primary truncate">{token.symbol || 'NULL'}</div>
        <div>${numeral(token.valueUsd).format('0,0.0')}</div>
        <div className="ml-2">
          {numeral(formatUnits(BigInt(token.amount), token.decimals))
            .format('0a.00')
            .toUpperCase()}
        </div>
      </div>
    )
  }

  return (
    <MessageBubble>
      <p className="mb-1 font-bold">{t('query.account.title')}</p>
      {Object.entries(entries).map(([c, a]) => {
        // Only show value >= 1 tokens.
        const tokens = filterTokens(a.tokens)
        const shouldCollapse = tokens.length > EXPAND_NUM

        return (
          <React.Fragment key={c}>
            {!chain && <p className="font-bold first-letter:uppercase">{c}</p>}
            <div className="border border-gray-300 rounded mb-2 relative">
              <div className="py-2 px-4 text-primary flex items-center">
                <span>{t('wallet')}</span>
                <Tooltip title={t('click-to-copy')}>
                  <span
                    className="ml-2 cursor-pointer"
                    onClick={() => copy(a.address)}
                  >
                    {utilFmt.addr(a.address)}
                  </span>
                </Tooltip>
                <span className="ml-2 text-black font-bold">
                  ${Number(numeral(a.value).format('0.00'))}
                </span>
              </div>
              {shouldCollapse ? (
                <Collapse in={isExpand} collapsedSize={140}>
                  {tokens.map(TokenRow)}
                </Collapse>
              ) : (
                <div>{tokens.map(TokenRow)}</div>
              )}

              {/* Expand shadow hints. */}
              <div
                className={clsx(
                  'absolute bottom-0 left-0 right-0 h-8 backdrop-blur-md',
                  'bg-gradient-to-b from-gray-100/50 to-gray-white/50',
                  'text-center leading-[2.5rem] text-zinc-600 text-sm',
                  'cursor-pointer flex items-center justify-center rounded',
                  !shouldCollapse && 'hidden',
                  isExpand && 'relative'
                )}
                onClick={() => {
                  if (!shouldCollapse) return
                  setIsExpand(!isExpand)
                }}
              >
                <span>
                  {isExpand ? t('bubble.show.hide') : t('bubble.show.more')}
                </span>
                <IoIosArrowDown
                  className={clsx(
                    'ml-2 transition-all duration-300',
                    isExpand && 'rotate-180'
                  )}
                  size={18}
                />
              </div>
            </div>
          </React.Fragment>
        )
      })}
    </MessageBubble>
  )
}

export default AccountQueryMessage
