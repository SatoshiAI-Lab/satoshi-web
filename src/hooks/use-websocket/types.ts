export interface UseWebSocketOptions {
  /**
   * WebSocket URL. if it's string, establish the WebSocket connection immediately.
   * If you don't want to connect immediately, please use the connect function.
   **/
  url?: string

  /**
   * If `true`, auto send a `ping` string message after connected.
   *
   * If `string`, send this string message after connected.
   */
  heartbeat?: boolean | string
  /**
   * The interval time of heartbeat. unit is seconds.
   *
   * Default, keep heartbeat is each 10 seconds.
   *
   * If `0` or `undefined`, won't keep heartbeat.
   */
  interval?: number

  /**
   * On WebSocket connect open.
   * @param event Origin WebSocket event.
   */
  onOpen?: (event: Event) => void

  /**
   * On WebSocket receive message.
   */
  onMessage?: (event: MessageEvent) => void

  /**
   * On WebSocket connect close.
   * @param event Origin WebSocket event.
   */
  onClose?: (event: CloseEvent) => void

  /**
   * On WebSocket happening error.
   * @param event Origin WebSocket event.
   */
  onError?: (event: Event) => void
}

export type WebSocketSendData = Parameters<WebSocket['send']>['0']
