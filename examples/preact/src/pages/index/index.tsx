import '../../main.css'

import { create } from 'channelstate'
import { createRoot } from 'react-dom/client'
import { Hello } from '../../shared/Hello'
import { initialState } from '../../shared/state'

const store = create.primary('store', initialState)

function App() {
  return (
    <div className='flex h-[100svh] w-[100svw]'>
      <Hello className='!h-full !w-1/2' title='PrimaryChannelState' store={store} />
      <iframe className='h-full w-1/2 border-none' src='/replica1' />
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
