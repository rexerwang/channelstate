import { createStore } from '../vanilla'
import { type CreateChannelStateOptions, createChannelStateImpl } from './createChannelStateImpl'

export interface CreatePrimaryChannelStateOptions extends CreateChannelStateOptions {}

export function createPrimaryChannelStateImpl<TState>(
  channelName: string,
  initialState: TState,
  options?: CreatePrimaryChannelStateOptions,
) {
  const syncOnInit = options?.syncOnInit !== false

  return createChannelStateImpl<TState>(channelName, (api) => {
    const store = createStore(initialState)

    const postSyncMessage = (receiver?: string) => {
      api.postMessage({
        action: 'sync',
        receiver,
        state: store.getState(),
      })
    }

    // broadcast to all replica channels when state changes
    const unsubscribe = store.subscribe(() => {
      postSyncMessage()
    })

    return {
      setupStore() {
        return store
      },
      onMessage(message) {
        switch (message.action) {
          case 'write': {
            const { state, replace } = message
            store.setState(state, replace)
            break
          }
          case 'requestSync': {
            postSyncMessage(message.sender) // unicast to the sender
            break
          }
        }
      },
      onInit() {
        if (syncOnInit) postSyncMessage()
      },
      onClose() {
        unsubscribe()
      },
    }
  })
}
