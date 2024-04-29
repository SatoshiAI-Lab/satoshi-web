import MessageBubble from '../../message-bubble'

import { MetaType } from '@/api/chat/types'
import { useSwapProviderProvider } from '@/hooks/use-swap/use-swap-provider'
import { WalletList } from './wallet-list'
import { useTxLogic } from '@/hooks/use-swap/use-tx-logic'
import { SelectAmount } from './select-amount'
import { SelectSwapRow } from './select-swap-row'
import { SelecSlippage } from './select-slippage'
import { SwapConfirm } from './swap-confirn'
import { SwapContext, TxLogicContext } from '@/hooks/use-swap/context'
import { useMessagesContext } from '@/contexts/messages'

export const TxTokenBubbles = () => {
  const { getMetaData } = useMessagesContext()
  const data = getMetaData<MetaType.Tx>()
  const isBuy = true // TODO: Wait for implementation

  // const data = props.msg.data as unknown as ChatResponseTxConfrim
  // const isBuy = props.msg.type == CHAT_CONFIG.metadataType.transactionConfirmBuy

  const options = {
    isBuy,
    data,
  }

  const { currentWallet, contextValue, selectFromToken, selectToToken } =
    useSwapProviderProvider(options)
  const { txLogigcContextValue } = useTxLogic({
    ...options,
    selectFromToken,
    selectToToken,
    currentWallet,
  })

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
