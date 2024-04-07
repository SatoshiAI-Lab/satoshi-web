/**
 * Management chat response config.
 */
export const CHAT_CONFIG = {
  /** use stream chat */
  useStream: true,
  /** `answer_type` prop description */
  answerType: {
    /** it's need `useStream` */
    streams: [
      'text',
      'chat_stream',
      'news_stream',
      'risk_analysis_stream',
      'data_insights_stream',
      'tech_analyze_stream',
      'tech_analyze_stream',
      '',
      'transaction_stream',
      'tech_analyze_stream',
    ],

    intention: [
      'wallet_list',
      'wallet_list_stream',
      'contract_wallet_balance',
      'change_name_wallet_list',
      'create_wallet_stream',
      'import_wallet_stream',
      'update_wallet_name_stream',
      'export_private_key_stream',
      'intent_history', // wallet balance
      'subscript_news',
      'subscript_wallet_address',
      'subscript_twitter',
      'wrong_contract',
      'transaction_confirm',
      'transaction_confirm_stream',
    ],

    /** it's not need `useStream` */
    normals: [
      'token_basic',
      'news',
      'risk_analysis',
      'review',
      'data_insights',
      'tech_analyze',
    ],
    interactive: 'interactive',
    /** Should be hidden type */
    hide: 'hide',
    reference: 'reference',
    /** answer ended */
    end: 'end',

    intentStream: 'intent_',
    walletList: 'wallet_list_stream',
    walletChangeName: 'change_name_wallet_list',
  },
  /** `hyper_text` parse RegExp */
  hyperTextRule:
    /message|text|<blank.*?\/>|<pct-change.*?>.*?<\/pct-change>|link/g,
  refRule: {
    refNumber: /\[(\d+)\]/g,
    refElement: /<reference .*? \/>/g,
    tokenProp: 'dataTokenTag',
  },
  metadataType: {
    intentHistory: 'intent_history',
    walletList: 'wallet_list',
    walletBalance: 'contract_wallet_balance',
    changeNameWalletList: 'change_name_wallet_list',
    twitterList: 'subscript_twitter',
    transactionConfirm: 'transaction_confirm',
  },
}
