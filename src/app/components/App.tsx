import { useState } from '../../domain/hooks/services/useState'
import { createPortal } from '../../platform/dom/createPortal'
import { ReduxExample } from './ReduxExample'

export function App() {
  const [count, setCount] = useState<number>(0)
  const [showRedux, setShowRedux] = useState<boolean>(false)

  const modalRoot =
    document.getElementById('modal-root') ??
    (() => {
      const div = document.createElement('div')
      div.id = 'modal-root'
      document.body.appendChild(div)
      return div
    })()

  return (
    <div id="app">
      <h1>Flect - React Clone</h1>

      {showRedux && <ReduxExample />}

      {modalRoot && createPortal(<div className="modal">I'm a modal</div>, modalRoot!)}
    </div>
  )
}
