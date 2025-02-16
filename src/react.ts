import { type Draft, produce } from 'immer'
import { useDebugValue } from 'react'
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector'
import type { ChannelStateApi } from './index'
import type { MaybePartial } from './vanilla'

export type Return<T, U> = readonly [
  state: U,
  setState: (nextStateOrUpdater: MaybePartial<T> | ((draft: Draft<T>) => void), replace?: boolean) => void,
]

export function useChannelState<T, U = T>(
  api: ChannelStateApi<T>,
  selector: (state: T) => U = (v: any) => v,
  equalityFn?: (a: U, b: U) => boolean,
): Return<T, U> {
  const state = useSyncExternalStoreWithSelector(api.subscribe, api.getState, undefined, selector, equalityFn)
  const setState: Return<T, U>[1] = (nextStateOrUpdater, replace) => {
    const nextState =
      typeof nextStateOrUpdater === 'function' ? produce(api.getState(), nextStateOrUpdater as any) : nextStateOrUpdater
    api.setState(nextState, replace)
  }

  useDebugValue(state)

  return [state, setState]
}
