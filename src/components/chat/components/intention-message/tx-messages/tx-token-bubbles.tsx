import MessageBubble from '../../message-bubble'

import { MetaType } from '@/api/chat/types'
import { useSwapProviderProvider } from '@/hooks/use-swap/use-swap-provider'
import { WalletList } from './wallet-list'
import { useTxLogic } from '@/hooks/use-swap/use-tx-logic'
import { SelectAmount } from './select-amount'
import { SelectSwapRow } from './select-swap-row'
import { SelecSlippage } from './select-slippage'
import { SwapConfirm } from './swap-confirn'
import { SwapContext } from '@/hooks/use-swap/use-swap-provider'
import { useMessagesContext } from '@/contexts/messages'
import { useTranslation } from 'react-i18next'
import { TxLogicContext } from '@/hooks/use-swap/use-tx-logic'

export const TxTokenBubbles = () => {
  const { getMetaData } = useMessagesContext()
  const data = getMetaData<MetaType.Tx>()
  const { t } = useTranslation()

  const options = {
    data,
  }

  const {
    currentWallet,
    contextValue,
    selectFromToken,
    selectToToken,
    loadingFromTokenList,
    insufficientBalanceMsg,
    loadingAllWallet,
  } = useSwapProviderProvider(options)

  const { txLogigcContextValue } = useTxLogic({
    ...options,
    selectFromToken,
    selectToToken,
    currentWallet,
  })

  if (loadingAllWallet) {
    return <MessageBubble>{t('loading.wallet')}</MessageBubble>
  }

  if (loadingFromTokenList || loadingFromTokenList) {
    return <MessageBubble>{t('searching.tokens')}</MessageBubble>
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
