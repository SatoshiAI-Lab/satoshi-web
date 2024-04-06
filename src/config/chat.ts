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
      'wallet_list_stream',
      'transaction_stream',
      'tech_analyze_stream',
      'create_wallet_stream',
      'import_wallet_stream',
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

    intentStream: 'intent_stream',
    walletList: 'wallet_list_stream',
  },
  /** `hyper_text` parse RegExp */
  hyperTextRule:
    /message|text|<blank.*?\/>|<pct-change.*?>.*?<\/pct-change>|link/g,
  refRule: {
    refNumber: /\[(\d+)\]/g,
    refElement: /<reference .*? \/>/g,
    tokenProp: 'dataTokenTag',
  },
}
