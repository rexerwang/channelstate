export * from './vanilla/shallow'

export type MaybePartial<T> = T | Partial<T>

export type StoreApi<T> = {
  getState(): T
  getInitialState(): T
  /**
   * @param nextState The next (partial) state.
   * @param replace If true, the next state will replace the current state.
   */
  setState(nextState: MaybePartial<T>, replace?: boolean): void
  /**
   * @returns unsubscribe
   */
  subscribe(listener: (state: T, prevState: T) => void): () => void
}

export function createStore<TState>(initialState: TState): StoreApi<TState> {
  type TStoreApi = StoreApi<TState>
  type Listener = Parameters<TStoreApi['subscribe']>[0]

  let state = initialState
  const listeners = new Set<Listener>()

  const setState: TStoreApi['setState'] = (nextState, replace) => {
    if (!Object.is(nextState, state)) {
      const preState = state
      state =
        (replace ?? (typeof nextState !== 'object' || nextState === null))
          ? (nextState as TState)
          : Object.assign({}, state, nextState)
      for (const listener of listeners) {
        listener(state, preState)
      }
    }
  }

  const getState: TStoreApi['getState'] = () => state

  const getInitialState: TStoreApi['getInitialState'] = () => initialState

  const subscribe: TStoreApi['subscribe'] = (listener) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  return { getState, getInitialState, setState, subscribe }
}
