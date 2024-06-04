import MessageBubble from '../../message-bubble'

import { MetaType, MultiChainCoin } from '@/api/chat/types'
import { useSwapProviderProvider } from '@/hooks/use-swap/use-swap-provider'
import { WalletList } from './wallet-list'
import { useSwapConfirmLogic } from '@/hooks/use-swap/use-swap-confirm-logic'
import { SelectAmount } from './select-amount'
import { SelectSwapRow } from './select-swap-row'
import { SelecSlippage } from './select-slippage'
import { SwapConfirm } from './swap-confirn'
import { SwapContext } from '@/hooks/use-swap/use-swap-provider'
import { useMessagesContext } from '@/contexts/messages'
import { useTranslation } from 'react-i18next'
import { TxLogicContext } from '@/hooks/use-swap/use-swap-confirm-logic'
import { Button, CircularProgress } from '@mui/material'
import { utilFmt } from '@/utils/format'
import { utilSwap } from '@/utils/swap'
import { useCreateWallet } from '@/hooks/use-swap/use-create-wallet'
import toast from 'react-hot-toast'

export const TxTokenBubbles = () => {
  const { getMetaData } = useMessagesContext()
  const data = getMetaData<MetaType.Tx>()
  const { t } = useTranslation()

  const options = {
    data,
  }

  const {
    fromWallet,
    contextValue,
    selectFromToken,
    selectToToken,
    loadingFromTokenList,
    loadingToTokenList,
    loadingAllWallet,
    receiveWallet,
    chains,
    intentTokenInfo,
  } = useSwapProviderProvider(options)

  const { txLogigcContextValue } = useSwapConfirmLogic({
    ...options,
    selectFromToken,
    selectToToken,
    fromWallet,
    receiveWallet,
  })

  const { createWalletLoading, onCreateWallet } = useCreateWallet()

  if (loadingAllWallet) {
    return <MessageBubble>{t('loading.wallet')}</MessageBubble>
  }

  if (loadingFromTokenList || loadingToTokenList) {
    return <MessageBubble>{t('searching.tokens')}</MessageBubble>
  }

  if (chains.length === 0) {
    return <MessageBubble>{t('loading.chains')}</MessageBubble>
  }

  if (intentTokenInfo.fromTokenInfo === intentTokenInfo.toTokenInfo) {
    if (intentTokenInfo.fromIntentChain === intentTokenInfo.toIntentChain) {
      return <MessageBubble>{t('same.token')}</MessageBubble>
    }

    if (
      intentTokenInfo.fromIntentChain === '' ||
      intentTokenInfo.toIntentChain === ''
    ) {
      return <MessageBubble>{t('need.token.chain')}</MessageBubble>
    }
  }

  if (
    intentTokenInfo.isToNotSupperChain.current ||
    intentTokenInfo.isFromNotSupperChain.current
  ) {
    const chain = intentTokenInfo.isToNotSupperChain.current
      ? chains.find((c) =>
          utilSwap.isTokenBaseInfo(
            c.token as MultiChainCoin,
            data.to_token.content
          )
        )
      : chains.find((c) =>
          utilSwap.isTokenBaseInfo(
            c.token as MultiChainCoin,
            data.from_token.content
          )
        )

    const tokenName = intentTokenInfo.isToNotSupperChain.current
      ? data.to_token.content
      : data.from_token.content

    return (
      <MessageBubble>
        <div className="font-bold">
          {t('not.find.wallet')
            .replace('$1', utilFmt.fisrtCharUppercase(chain?.name!))
            .replace('$2', tokenName)}
        </div>
        <Button
          variant="contained"
          className="!mt-2 !mb-1 !rounded-full"
          onClick={async () => {
            try {
              await onCreateWallet(chain?.platform!)
              toast.success(t('wallet.createsuccess'))
              intentTokenInfo.isToNotSupperChain.current
                ? (intentTokenInfo.isToNotSupperChain.current = false)
                : (intentTokenInfo.isFromNotSupperChain.current = false)
            } catch (e) {
              toast.error(t('wallet.create-failed'))
            }
          }}
          disabled={createWalletLoading}
        >
          {createWalletLoading ? (
            <CircularProgress size={16} className="mr-2"></CircularProgress>
          ) : null}
          {t('create.wallet').replace(
            '$1',
            utilFmt.fisrtCharUppercase(chain?.name!)
          )}
        </Button>
      </MessageBubble>
    )
  }

  return (
    <SwapContext.Provider value={contextValue}>
      <TxLogicContext.Provider value={txLogigcContextValue}>
        <MessageBubble className={`min-w-[350px]`}>
          <SelectSwapRow />

          <SelectAmount />

          <WalletList />

          <SelecSlippage />

          <SwapConfirm />
        </MessageBubble>
      </TxLogicContext.Provider>
    </SwapContext.Provider>
  )
}

// data: {"answer_type": "process_stream", "text": "Identifying inquiries...", "hyper_text": "", "error": "", "meta": {}}

// data: {"answer_type": "process_stream", "text": "Developing solutions..", "hyper_text": "", "error": "", "meta": {}}

// data: {"answer_type": "process_stream_end", "text": "", "hyper_text": "", "error": "", "meta": {}}

// data: {"answer_type": "intent_stream", "text": "", "hyper_text": "", "error": "", "meta": {"type": "transaction", "data": {"from_token": {"type": "token", "content": "USDC", "chain_name": "arbitrum"}, "to_token": {"type": "token", "content": "OP", "chain_name": "optimism"}, "amount": 0.0}}}

// data: {"answer_type": "end", "text": "", "hyper_text": "", "error": "", "meta": {"emotion": "Neutral"}}

// data: {"answer_type": "process_stream", "text": "Identifying inquiries...", "hyper_text": "", "error": "", "meta": {}}

// data: {"answer_type": "process_stream", "text": "Developing solutions..", "hyper_text": "", "error": "", "meta": {}}

// data: {"answer_type": "process_stream_end", "text": "", "hyper_text": "", "error": "", "meta": {}}

// data: {"answer_type": "intent_stream", "text": "", "hyper_text": "", "error": "", "meta": {"type": "transaction", "data": {"from_token": {"type": "token", "content": "USDC", "chain_name": "arbitrum"}, "to_token": {"type": "token", "content": "OP", "chain_name": "optimism"}, "amount": 0.0}}}

// data: {"answer_type": "end", "text": "", "hyper_text": "", "error": "", "meta": {"emotion": "Neutral"}}
