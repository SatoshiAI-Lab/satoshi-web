import MessageBubble from '../../message-bubble'

import { MetaType } from '@/api/chat/types'
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
    loadingAllWallet,
    receiveWallet,
  } = useSwapProviderProvider(options)

  const { txLogigcContextValue } = useSwapConfirmLogic({
    ...options,
    selectFromToken,
    selectToToken,
    fromWallet,
    receiveWallet,
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
