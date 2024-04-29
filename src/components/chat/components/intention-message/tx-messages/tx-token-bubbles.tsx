import MessageBubble from '../../message-bubble'

import { CHAT_CONFIG } from '@/config/chat'
import { useSwapProviderProvider } from '@/hooks/use-swap/use-swap-provider'
import { WalletList } from './wallet-list'
import { useTxLogic } from '@/hooks/use-swap/use-tx-logic'
import { SelectAmount } from './select-amount'
import { SelectSwapRow } from './select-swap-row'
import { SelecSlippage } from './select-slippage'
import { SwapConfirm } from './swap-confirn'

import type { ChatResponseMeta, ChatResponseTxConfrim } from '@/api/chat/types'
import { SwapContext, TxLogicContext } from '@/hooks/use-swap/context'
interface Props {
  msg: ChatResponseMeta
}
export const TxTokenBubbles = (props: Props) => {
  const data = props.msg.data as unknown as ChatResponseTxConfrim
  const isBuy = props.msg.type == CHAT_CONFIG.metadataType.transactionConfirmBuy

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
