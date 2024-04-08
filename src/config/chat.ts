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
      'tech_analyze_stream',
    ],

    intention: [
      'wallet_list',
      'wallet_list_stream',
      'contract_wallet_balance',
      'change_name_wallet_list',
      'delete_wallet_stream',
      'create_wallet_stream',
      'import_wallet_stream',
      'update_wallet_name_stream',
      'export_private_key_stream',
      'intent_history', // wallet balance
      'subscript_news',
      'subscript_wallet_address',
      'subscript_twitter',
      'wrong_contract',
      'transaction_confirm_buy',
      'transaction_confirm_stream',
      'subscript_news',
      'transaction_stream',
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
    moniotrWallet: 'subscript_wallet_address_success',
    walletList: 'wallet_list',
    walletBalance: 'contract_wallet_balance',
    twitterList: 'subscript_twitter_list',
    monitorWalletFail: 'subscript_wallet_address_fail',
    changeNameWalletList: 'change_name_wallet_list',
    exportWalletList: 'export_wallet_list',
    deleteNameWalletList: 'delete_name_wallet_list',
  },

  intentTxToken: ['transaction_confirm_buy', 'transaction_confirm_sell'],

  intentSelectWalletType: [
    'change_name_wallet_list',
    'export_wallet_list',
    'delete_name_wallet_list',
  ],

  hiddenIntentText: [
    'subscript_twitter_list',
    'delete_name_wallet_list',
    'subscript_wallet_address_success',
  ],
}
