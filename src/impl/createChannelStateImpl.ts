import type { MaybePartial, StoreApi } from '../vanilla'
import { uuid } from './uuid'

export type ChannelMessage<T> =
  | {
      action: 'write'
      state: MaybePartial<T>
      replace?: boolean
    }
  | {
      action: 'sync'
      receiver?: string
      state: MaybePartial<T>
      replace?: boolean
    }
  | {
      action: 'requestSync'
    }

export type ChannelMessageReceived<T> = ChannelMessage<T> & { sender: string }

export interface ChannelApi<T> extends BroadcastChannel {
  id: string
  postMessage(message: ChannelMessage<T>): void
}

export interface ChannelStateApi<T> extends StoreApi<T> {
  id: string
  close(): void
}

export interface CreateChannelStateOptions {
  /** @default true */
  syncOnInit?: boolean
}

export type ChannelStateCreator<T> = (api: ChannelApi<T>) => {
  setupStore(): StoreApi<T>
  onMessage(message: ChannelMessageReceived<T>): void
  onInit?(): void
  onClose?(): void
}

export function createChannelStateImpl<TState>(
  channelName: string,
  creator: ChannelStateCreator<TState>,
): ChannelStateApi<TState> {
  const channel = new BroadcastChannel(channelName)
  const id = uuid()

  const { setupStore, onMessage, onInit, onClose } = creator(
    Object.assign({ id }, channel, {
      postMessage(message: ChannelMessage<TState>) {
        channel.postMessage({ ...message, sender: id })
      },
    }),
  )

  channel.addEventListener('message', ({ data }: MessageEvent<ChannelMessageReceived<TState>>) => {
    if (data.action && data.sender && data.sender !== id) {
      onMessage(data)
    }
  })

  onInit?.()

  return Object.assign(setupStore(), {
    id,
    close() {
      onClose?.()
      channel.close()
    },
  })
}
