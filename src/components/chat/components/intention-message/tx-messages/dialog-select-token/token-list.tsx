import { ChatResponseWalletListToken, MultiChainCoin } from '@/api/chat/types'
import PercentTag from '@/components/percent-tag'
import { utilFmt } from '@/utils/format'
import { MenuItem, Avatar } from '@mui/material'
import { useState } from 'react'

interface Props {
  selectChainId: string
  searchValue: string
  searchTokens: MultiChainCoin[]
  selectWalletTokens?: ChatResponseWalletListToken[]
  isNameSearch: boolean
}

export const TokenList = ({
  searchValue,
  searchTokens,
  selectWalletTokens,
  selectChainId,
}: Props) => {
  let tokens: any[] = []

  //   if (searchValue.trim() !== '') {
  tokens = selectWalletTokens?.map((token) => {
    for (const t of searchTokens) {
      if (token.address === t.address && token.chain.id === t.chain.name) {
        return t
      }
    }
    return token
  }) || []
  //   }

  return (
    <div className="my-4">
      {tokens
        ?.filter((t) => t.chain.id === selectChainId || selectChainId === '-1')
        .map((token) => {
          return <TokenItem token={token} />
        })}
    </div>
  )
}

interface TokenItemProps {
  token: MultiChainCoin & ChatResponseWalletListToken
}

const TokenItem = (props: TokenItemProps) => {
  const { token } = props
  return (
    <MenuItem className="!px-6">
      <div className="w-full flex justify-between items-center">
        <div className="flex">
          <Avatar
            src={token.logo || token.logoUrl}
            className="w-[35px] h-[35px] mr-2"
          >
            {token.symbol.slice(0, 1)}
          </Avatar>
          <div className="">
            <div>{token.symbol}</div>
            <div className="text-sm text-gray-400">{token.chain.name}</div>
          </div>
        </div>
        <div className="flex">
          <div className="text-right">
            <div>${utilFmt.token(token.value_usd ?? 0)}</div>
            <div className="flex text-sm text-gray-400">
              ${utilFmt.token(token.price_usd)}
              <PercentTag
                percent={token.price_change_24h}
                className="ml-1 text-sm"
              />
              {/* {formatUnits(BigInt(token!.amount), token.decimals)} */}
            </div>
          </div>
        </div>
      </div>
    </MenuItem>
  )
}
