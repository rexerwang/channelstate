import type { ChannelStateApi } from 'channelstate'
import { useChannelState } from 'channelstate/react'
import { useEffect, useState } from 'react'

export interface IState {
  from: string
  hello: {
    message: string
    updateAt: string
  }
}

export const initialState: IState = {
  from: location.pathname,
  hello: {
    message: '',
    updateAt: '',
  },
}

export function useStateSnapshots<T>(store: ChannelStateApi<T>) {
  const [state] = useChannelState(store)
  const [snapshots, setSnapshots] = useState<T[]>([])

  useEffect(() => {
    setSnapshots((prev) => [state, ...prev])
  }, [state])

  return snapshots
}
