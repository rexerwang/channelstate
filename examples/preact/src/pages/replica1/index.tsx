import '../../main.css'

import { createReplicaChannelState } from 'channelstate'
import { createRoot } from 'react-dom/client'
import { Hello } from '../../shared/Hello'
import { initialState } from '../../shared/state'

const store = createReplicaChannelState('store', initialState)

function App() {
  return <Hello title='ReplicaChannelState #1' store={store} />
}

createRoot(document.getElementById('root')!).render(<App />)
