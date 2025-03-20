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

export function useStateSnapshots(store: ChannelStateApi<any>) {
  const [state] = useChannelState(store)
  const [snapshots, setSnapshots] = useState<string[]>([])

  useEffect(() => {
    setSnapshots((prev) => [JSON.stringify(state), ...prev])
  }, [state])

  return snapshots
}
