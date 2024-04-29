import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { isEmpty } from 'lodash'
import { Button } from '@mui/material'
import { nanoid } from 'nanoid'
import { isAddress } from 'viem'

import { useMessagesContext } from '@/contexts/messages'
import { CheckAddrType, MetaType } from '@/api/chat/types'
import { LoadingMessage } from '../../loading-message'
import { tokenApi } from '@/api/token'
import { ResponseCode } from '@/api/fetcher/types'
import { MessageBubble } from '../../message-bubble'
import { AccountQueryMessage } from './account-query-message'
import { TokenQueryMessage } from './token-query-message'
import { ChainSelectMessage } from '../../chain-select-message'
import { Chain } from '@/config/wallet'
import { validator } from '@/utils/validator'

export const CheckAddrMessage = () => {
  const { t } = useTranslation()
  const { getMetaData } = useMessagesContext()
  const { type, chain_name, address } = getMetaData<MetaType.CheckAddr>()
  const [selectedType, setSelectedType] = useState(type)
  const [selectedChain, setSelectedChain] = useState(chain_name)
  const idRef = useRef('')
  const typeIsEmpty = isEmpty(selectedType)
  const chainIsEmpty = isEmpty(selectedChain)
  const addressIsEmpty = isEmpty(address)
  const isToken = selectedType === 'token'
  const isAccount = selectedType === 'account'

  // Query account or token.
  const { data, isError, isLoading } = useQuery({
    enabled: !typeIsEmpty && !addressIsEmpty,
    queryKey: [tokenApi.queryAddr.name + idRef.current, selectedType, address],
    queryFn: () => {
      return tokenApi.queryAddr({ address, type: selectedType })
    },
  })
  const { data: addresses, code } = data ?? {}
  const isAddrErr = isError || (code && code !== ResponseCode.Success)

  // Only query token.
  const {
    data: infoData,
    isError: isTokenError,
    isLoading: isLoadingInfo,
  } = useQuery({
    enabled: !chainIsEmpty && !addressIsEmpty,
    queryKey: [tokenApi.info.name + idRef.current],
    queryFn: () => {
      return tokenApi.info({ chain: selectedChain, address })
    },
  })
  const { data: tokenInfo, code: tokenCode } = infoData ?? {}
  const isTokenErr =
    isTokenError || (tokenCode && tokenCode !== ResponseCode.Success)

  const selectDefaultChain = () => {
    // If is not empty, don't set.
    if (!chainIsEmpty) return

    // Is ethereum addr.
    // if (isAddress(address)) {
    //   setSelectedChain(Chain.Eth)
    //   return
    // }

    // Is solana addr.
    if (validator.isSolAddr(address)) {
      setSelectedChain(Chain.Sol)
      return
    }
  }

  // Set once default chain if supported, don't add any dependencies!!!
  // Needs to be called before mounted, so it's not placed in `useEffect`.
  // If placed in `useEffect`, `ChainSelectMessage` will be blink.
  useMemo(() => {
    selectDefaultChain()
  }, [])

  // Unique key query
  useEffect(() => {
    idRef.current = nanoid()
  }, [])

  // `type` is empty, ask user to choose token or account.
  if (typeIsEmpty) {
    return (
      <MessageBubble>
        <p>{t('query.title')}</p>
        <div className="flex items-center mt-2 gap-2">
          {Object.values(CheckAddrType).map((type) => (
            <Button
              key={type}
              variant="outlined"
              size="small"
              className="!flex-1"
              onClick={() => setSelectedType(type)}
            >
              <span className="first-letter:!uppercase">{t(type)}</span>
            </Button>
          ))}
        </div>
      </MessageBubble>
    )
  }

  // `chain_name` is empty, ask user to choose chain.
  if (chainIsEmpty) {
    return (
      <ChainSelectMessage
        title={t('query.select-chain')}
        onClick={(c) => setSelectedChain(c.name)}
      />
    )
  }

  // Querying.
  if (isLoading || isLoadingInfo) {
    return <LoadingMessage children={t('addr.querying')} />
  }

  // Query failed.
  if (isAddrErr || isTokenErr) {
    return <MessageBubble children={t('addr.query.failed')} />
  }

  // Query success, is token.
  if (isToken && tokenInfo) {
    return <TokenQueryMessage info={tokenInfo} />
  }

  // Query success, is account(wallet).
  if (isAccount && addresses) {
    return (
      <AccountQueryMessage
        accounts={addresses.accounts}
        chain={selectedChain}
      />
    )
  }

  return <LoadingMessage children={t('waiting-moment')} />
}

export default CheckAddrMessage
