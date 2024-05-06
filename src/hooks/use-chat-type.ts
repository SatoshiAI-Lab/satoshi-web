import { isEmpty } from 'lodash'

import {
  ChatMeta,
  AnswerType,
  MetaType,
  MetaTypeCategory,
} from '@/api/chat/types'
import { DataType } from '@/stores/use-chat-store/types'

export const useChatType = () => {
  const processAnswerType = (type?: `${AnswerType}`) => {
    if (!type) return {}

    return {
      isEmpty: isEmpty(type),

      isNonStream: !type.endsWith('stream'),
      isStream: type.endsWith('stream'),
      isEnd: type === AnswerType.End,

      isInteractive: type === AnswerType.Interactive,
      isReference: type === AnswerType.Reference,
      isHide: type === AnswerType.Hide,

      isProcess: type === AnswerType.ProcessStream,
      isProcessEnd: type === AnswerType.ProcessStreamEnd,
      isIntent: type === AnswerType.IntentStream,
      isNormalChat: type === AnswerType.ChatStream,

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

  const hasEmotion = (meta: ChatMeta) => !!meta.emotion

  return {
    processAnswerType,
    processMetaType,
    processDataType,
    hasEmotion,
  }
}
