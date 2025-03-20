import { type Draft, produce } from 'immer'
import { useDebugValue, useSyncExternalStore } from 'react'
import type { ChannelStateApi, CreateChannelStateOptions } from './impl/createChannelStateImpl'
import {
  type CreatePrimaryChannelStateOptions,
  createPrimaryChannelStateImpl,
} from './impl/createPrimaryChannelStateImpl'
import {
  type CreateReplicaChannelStateOptions,
  createReplicaChannelStateImpl,
} from './impl/createReplicaChannelStateImpl'
import type { MaybePartial } from './vanilla'

export type SetChannelState<T> = (
  nextStateOrUpdater: MaybePartial<T> | ((draft: Draft<T>) => void),
  replace?: boolean,
) => void

function useChannelStateImpl<T>(api: ChannelStateApi<T>): [state: T, setState: SetChannelState<T>] {
  const state = useSyncExternalStore(api.subscribe, api.getState, api.getInitialState)
  const setState: SetChannelState<T> = (nextStateOrUpdater, replace) => {
    const nextState =
      typeof nextStateOrUpdater === 'function' ? produce(api.getState(), nextStateOrUpdater as any) : nextStateOrUpdater
    api.setState(nextState, replace)
  }

  useDebugValue(state)

  return [state, setState]
}

export type UseChannelState<T> = ChannelStateApi<T> & (() => [state: T, setState: SetChannelState<T>])

export function create<TState extends object, TOption extends CreateChannelStateOptions>(
  isPrimary: boolean,
  channelName: string,
  initialState: TState,
  options?: TOption,
): UseChannelState<TState> {
  const createImpl = isPrimary ? createPrimaryChannelStateImpl : createReplicaChannelStateImpl
  const api = createImpl(channelName, initialState, options)
  const useChannelState = () => useChannelStateImpl(api)
  return Object.assign(useChannelState, api)
}

create.primary = <T extends object>(
  channelName: string,
  initialState: T,
  options?: CreatePrimaryChannelStateOptions,
) => {
  return create(true, channelName, initialState, options)
}

create.replica = <T extends object>(
  channelName: string,
  initialState: T,
  options?: CreateReplicaChannelStateOptions,
) => {
  return create(false, channelName, initialState, options)
}
