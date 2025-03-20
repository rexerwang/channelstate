import type { UseChannelState } from 'channelstate'
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

export function useStateSnapshots(store: UseChannelState<any>) {
  const [state] = store()
  const [snapshots, setSnapshots] = useState<string[]>([])

  useEffect(() => {
    setSnapshots((prev) => [JSON.stringify(state), ...prev])
  }, [state])

  return snapshots
}
