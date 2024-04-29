import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Tooltip } from '@mui/material'

import { MessageBubble } from './message-bubble'
import { useWalletStore } from '@/stores/use-wallet-store'
import { Platform } from '@/config/wallet'

interface Props {
  title?: ReactNode
  onClick?: (p: Platform) => void
}

export const PlatformSelectMessage = (props: Props) => {
  const { title, onClick } = props
  const { platforms } = useWalletStore()
  const { t } = useTranslation()

  return (
    <MessageBubble>
      {title}
      <ul className="grid grid-cols-3 gap-2 mt-2">
        {platforms.map((p) => (
          <li key={p}>
            <Tooltip title={p === Platform.Evm && t('evm-support')}>
              <Button
                variant="outlined"
                size="small"
                className="w-full"
                onClick={() => onClick?.(p)}
              >
                {p}
              </Button>
            </Tooltip>
          </li>
        ))}
      </ul>
    </MessageBubble>
  )
}

export default PlatformSelectMessage
