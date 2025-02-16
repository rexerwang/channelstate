import { createStore } from '../vanilla'
import { type CreateChannelStateOptions, createChannelStateImpl } from './createChannelStateImpl'

export interface CreateReplicaChannelStateOptions extends CreateChannelStateOptions {}

export function createReplicaChannelState<TState extends object>(
  channelName: string,
  initialState: TState,
  options?: CreateReplicaChannelStateOptions,
) {
  const syncOnInit = options?.syncOnInit !== false

  return createChannelStateImpl<TState>(channelName, (api) => {
    const store = createStore(initialState)

    return {
      setupStore() {
        // Overwrite setState to request write to the primary channel
        const setState: typeof store.setState = (state, replace) => {
          api.postMessage({ action: 'write', state, replace })
        }
        return { ...store, setState }
      },
      onMessage(message) {
        switch (message.action) {
          case 'sync': {
            const { receiver, state } = message
            // On broadcast or unicast to this replica channel
            if (!receiver || receiver === api.id) {
              store.setState(state, true) // force sync by replacing state
            }
            break
          }
        }
      },
      onInit() {
        if (syncOnInit) api.postMessage({ action: 'requestSync' })
      },
    }
  })
}
