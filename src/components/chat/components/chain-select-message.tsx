import React, { ReactNode } from 'react'
import { Avatar, Button } from '@mui/material'

import type { ChainResInfo } from '@/api/wallet/params'

import { MessageBubble } from './message-bubble'
import { useWalletStore } from '@/stores/use-wallet-store'

interface Props {
  title?: ReactNode
  showAvatar?: boolean
  avatarSize?: number
  onClick?: (chain: ChainResInfo) => void
}

export const ChainSelectMessage = (props: Props) => {
  const { title, showAvatar = true, avatarSize = 16, onClick } = props
  const { chains } = useWalletStore()

  return (
    <MessageBubble className="!py-3">
      {title}
      <ul className="grid grid-cols-3 gap-2 mt-2">
        {chains.map((c) => (
          <Button
            key={c.name}
            variant="outlined"
            size="small"
            onClick={() => onClick?.(c)}
            className="!justify-start !items-center"
          >
            {showAvatar && (
              <Avatar
                src={c?.logo}
                sx={{ width: avatarSize, height: avatarSize }}
                children={c.name}
              />
            )}
            <span className="first-letter:uppercase ml-1">{c.name}</span>
          </Button>
        ))}
      </ul>
    </MessageBubble>
  )
}

export default ChainSelectMessage
