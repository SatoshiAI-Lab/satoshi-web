import { ChatMeta, AnswerType, MetaType } from '@/api/chat/types'

export const useChatType = () => {
  const parseAnswerType = (type: AnswerType) => {
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

  const parseMetaType = (type: MetaType) => {
    return {
      isTxConfirm: type === MetaType.TxConfirm,

      isWalletCreate: type === MetaType.WalletCreate,
      isWalletDelete: type === MetaType.WalletDelete,
      isWalletChange: type === MetaType.WalletChange,
      isWalletCheck: type === MetaType.WalletCheck,
      isWalletImport: type === MetaType.WalletImport,
      isWalletExport: type === MetaType.WalletExport,

      isSubNews: type === MetaType.SubNews,
      isSubTwitter: type === MetaType.SubTwitter,
      isSubAnn: type === MetaType.SubAnn,
      isSubWallet: type === MetaType.SubWallet,
      isSubPool: type === MetaType.SubPool,

      isTokenCreate: type === MetaType.TokenCreate,

      isCheckAddr: type === MetaType.CheckAddr,
    }
  }

  const hasEmotion = (meta: ChatMeta) => !!meta.emotion

  return {
    parseAnswerType,
    parseMetaType,
    hasEmotion,
  }
}
