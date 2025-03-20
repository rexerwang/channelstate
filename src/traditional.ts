import { useDebugValue } from 'react'
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector'
import type { ChannelStateApi } from './index'

type ExtractState<S> = S extends { getState: () => infer T } ? T : never

export function useChannelStateWithSelector<S extends ChannelStateApi<any>, T = ExtractState<S>, U = T>(
  api: S,
  selector: (state: T) => U = (v: any) => v,
  equalityFn?: (a: U, b: U) => boolean,
) {
  const state = useSyncExternalStoreWithSelector(api.subscribe, api.getState, api.getInitialState, selector, equalityFn)

  useDebugValue(state)

  return state
}
