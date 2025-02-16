import type { ChannelStateApi } from 'channelstate'
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
  const [snapshots, setSnapshots] = useState([store.getState()])

  useEffect(() => {
    return store.subscribe((state) => {
      setSnapshots((v) => [state, ...v])
    })
  }, [store])

  return snapshots
}
