import {
  ChatMeta,
  AnswerType,
  MetaType,
  MetaTypeCategory,
} from '@/api/chat/types'

export const useChatType = () => {
  const identifyAnswerType = (type?: `${AnswerType}`) => {
    if (!type) return {}

    return {
      isNormal: !type.endsWith('stream'),
      isStream: type.endsWith('stream'),
      isEnd: type === AnswerType.End,

      isInteractive: type === AnswerType.Interactive,
      isReference: type === AnswerType.Reference,
      isHide: type === AnswerType.Hide,

      isProcess: type === AnswerType.ProcessStream,
      isIntent: type === AnswerType.IntentStream,
    }
  }

  const identifyMetaType = (type?: `${MetaType}`) => {
    if (!type) return {}

    return {
      isTx: type.startsWith(MetaTypeCategory.TxPrefix),
      isTxConfirm: type === MetaType.TxConfirm,

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
      isSubAnn: type === MetaType.SubAnn,
      isSubWallet: type === MetaType.SubWallet,
      isSubPool: type === MetaType.SubPool,

      isToken: type.startsWith(MetaTypeCategory.TokenPrefix),
      isTokenCreate: type === MetaType.TokenCreate,

      isCheck: type.startsWith(MetaTypeCategory.CheckPrefix),
      isCheckAddr: type === MetaType.CheckAddr,
    }
  }

  const hasEmotion = (meta: ChatMeta) => !!meta.emotion

  return {
    identifyAnswerType,
    identifyMetaType,
    hasEmotion,
  }
}
