export type OnEvents<T = any> = Record<string, T>

export type EmitEvents<T = any> = Record<string, T>

export type EventHandler<T> = (arg: T) => void

/**
 * Simple event emitter, only used for useWebSocket hook.
 */
export class Emitter<OnEvents, EmitEvents> {
  private events: Record<string, EventHandler<any>[]> = {}

  public on<N extends keyof OnEvents>(
    name: N,
    handler: EventHandler<OnEvents[N]>
  ): void {
    if (!this.events[name]) {
      this.events[name] = []
    }
    this.events[name].push(handler)
  }

  public emit<N extends keyof EmitEvents>(name: N, data: EmitEvents[N]): void {
    const handlers = this.events[name]
    if (handlers) {
      handlers.forEach((handler) => {
        handler(data)
      })
    }
  }
}
