import '../../main.css'

import { create } from 'channelstate'
import { createRoot } from 'react-dom/client'
import { Hello } from '../../shared/Hello'
import { initialState } from '../../shared/state'

const store = create.replica('store', initialState)

function App() {
  return <Hello title='ReplicaChannelState #1' store={store} />
}

createRoot(document.getElementById('root')!).render(<App />)
