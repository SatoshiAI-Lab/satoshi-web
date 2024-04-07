export type OnEvents<T = any> = Record<string, T>

export type EmitEvents<T = any> = Record<string, T>

export type EventHandler<T> = (arg: T) => void

/**
 * Simple event emitter, it's not dependent on React.
 * you can use it in any environment.
 *
 * Implemented following APIs Currently:
 *
 * - on: Listening a event.
 * - emit: Emit a event.
 * - off: Unlistening a event.
 */
export const useEmitter = <OnEvents, EmitEvents>() => {
  let events: Record<string, EventHandler<any>[]> = {}

  const on = <E extends keyof OnEvents>(
    event: E,
    handler: EventHandler<OnEvents[E]>
  ) => {
    if (!events[event as string]) {
      events[event as string] = []
    }

    events[event as string].push(handler)
  }

  const emit = <E extends keyof EmitEvents>(event: E, data: EmitEvents[E]) => {
    const handlers = events[event as string]
    if (handlers) {
      handlers.forEach((handler) => handler(data))
    }
  }

  const off = <E extends keyof OnEvents>(event: E) => {
    delete events[event as string]
    if (Object.keys(events).length === 0) {
      events = {}
    }
  }

  return {
    on,
    emit,
    off,
  }
}
