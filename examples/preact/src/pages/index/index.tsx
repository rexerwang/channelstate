import '../../main.css'

import { createPrimaryChannelState } from 'channelstate'
import { createRoot } from 'react-dom/client'
import { Hello } from '../../shared/Hello'
import { initialState } from '../../shared/state'

const store = createPrimaryChannelState('store', initialState)

function App() {
  return (
    <div className='flex h-[100svh] w-[100svw]'>
      <Hello className='!h-full !w-1/2' title='PrimaryChannelState' store={store} />
      <iframe className='h-full w-1/2 border-none' src='/replica1' />
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
