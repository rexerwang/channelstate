import type { ChannelStateApi } from 'channelstate'
import { useChannelStateWithSelector } from 'channelstate/react'
import { shallow } from 'channelstate/vanilla'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { type IState, useStateSnapshots } from './state'

interface IProps {
  className?: string
  title: string
  store: ChannelStateApi<IState>
}

export function Hello({ className, title, store }: IProps) {
  const [message, setState] = useChannelStateWithSelector(store, (s) => s.hello.message, shallow)
  const snapshots = useStateSnapshots(store)
  const [auto, setAuto] = useState(false)

  const update = (val: string) => {
    setState((draft) => {
      draft.hello.message = val
      draft.hello.updateAt = new Date().toISOString()
      draft.from = store.getInitialState().from
    })
  }

  const countRef = useRef(0)
  // biome-ignore lint/correctness/useExhaustiveDependencies(update): <explanation>
  useEffect(() => {
    if (!auto) return
    const now = Date.now()
    const timer = setInterval(() => {
      if (Date.now() - now > 300000) stop()
      else update(`[${title}] Auto message #${++countRef.current}`)
    }, 1000)
    const stop = () => {
      clearInterval(timer)
      setAuto(false)
    }
    return stop
  }, [auto, title])

  return (
    <main className={clsx(className, 'flex h-[100svh] w-[100svw] flex-col gap-y-4 p-4')}>
      <h1 className='flex flex-shrink-0 items-start justify-center gap-1 font-bold text-5xl'>
        {title}
        <button
          className='cursor-pointer rounded bg-slate-800 px-1.5 py-1 font-light text-sm active:brightness-75'
          title='Toggle auto-update every 1s, stopping after 5min'
          onClick={() => setAuto((v) => !v)}>
          {auto ? '🟡 Stop' : '🟢 Auto'}
        </button>
      </h1>
      <div className='w-full flex-shrink-0 text-center'>
        <input
          className='w-full rounded-md border border-gray-300 p-2 text-black'
          type='text'
          placeholder='Type something...'
          value={message}
          onChange={(e) => update(e.target.value)}
        />
      </div>
      <ul className='w-full flex-1 overflow-auto'>
        <p className='font-semibold text-lg'>Store Snapshots:</p>
        {snapshots?.map((snapshot) => (
          <li key={snapshot.hello.updateAt + snapshot.hello.message} className='m-1 font-mono font-thin text-xs italic'>
            <pre>
              <code>{JSON.stringify(snapshot)}</code>
            </pre>
          </li>
        ))}
      </ul>
    </main>
  )
}
