import { isEmpty } from 'lodash'

import { AnswerType, MetaType, MetaTypeCategory } from '@/api/chat/types'
import { DataType, MessageRole } from '@/stores/use-chat-store/types'

export type UseChatTypeReturn = ReturnType<typeof useChatType>

export type UseChatTypeReturns = {
  [K in keyof UseChatTypeReturn]: ReturnType<UseChatTypeReturn[K]>
}

export const useChatType = () => {
  const processAnswerType = (type?: `${AnswerType}`) => {
    if (!type) return {}

    return {
      isEmpty: isEmpty(type),

      isNonStream: !type.includes('stream'),
      isInteractive: type === AnswerType.Interactive,
      isReference: type === AnswerType.Reference,
      isHide: type === AnswerType.Hide,
      isEnd: type === AnswerType.End,

      isStream: type.includes('stream'),
      isProcessStream: type === AnswerType.ProcessStream,
      isProcessStreamEnd: type === AnswerType.ProcessStreamEnd,
      isIntentStream: type === AnswerType.IntentStream,
      isChatStream: type === AnswerType.ChatStream,

      // Frontend custom type.
      isWsMonitor: type === AnswerType.WsMonitor,
    }
  }

  const processMetaType = (type?: `${MetaType}`) => {
    if (!type) {
      return {
        isEmpty: true,
      }
    }

    return {
      isEmpty: isEmpty(type),

      isTx: type === MetaType.Tx,

      isWallet: type.startsWith(MetaTypeCategory.WalletPrefix),
      isWalletCreate: type === MetaType.WalletCreate,
      isWalletDelete: type === MetaType.WalletDelete,
      isWalletChange: type === MetaType.WalletChange,
      isWalletCheck: type === MetaType.WalletCheck,
      isWalletImport: type === MetaType.WalletImport,
      isWalletExport: type === MetaType.WalletExport,

      isSub: type.startsWith(MetaTypeCategory.SubPrefix),
      isSubNews: type === MetaType.SubNews,
      isSubTwitter: type === MetaType.SubTwitter,
      isSubAnn: type === MetaType.SubExAnn,
      isSubWallet: type === MetaType.SubWallet,
      isSubPool: type === MetaType.SubPool,

      isToken: type.startsWith(MetaTypeCategory.TokenPrefix),
      isTokenCreate: type === MetaType.TokenCreate,

      isCheck: type.startsWith(MetaTypeCategory.CheckPrefix),
      isCheckAddr: type === MetaType.CheckAddr,

      isClearHistory: type === MetaType.ClearHistory,
    }
  }

  const processDataType = (type?: `${DataType}`) => {
    if (!type) return {}

    return {
      isMonitorNews: type === DataType.NewsInfo,
      isMonitorAnn: type === DataType.AnnInfo,
      isMonitorTrade: type === DataType.TradeInfo,
      isMonitorTwitter: type === DataType.TwitterInfo,
      isMonitorNewPool: type === DataType.PoolInfo,
    }
  }

  const processRoleType = (role?: MessageRole) => {
    if (!role) return {}

    return {
      isUser: role === 'user',
      isAssistant: role === 'assistant',
      isSystem: role === 'system',
    }
  }

  return {
    processAnswerType,
    processMetaType,
    processDataType,
    processRoleType,
  }
}
