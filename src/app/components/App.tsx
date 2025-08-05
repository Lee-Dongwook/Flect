import { useState } from '../../domain/hooks/services/useState'
import { createPortal } from '../../platform/dom/createPortal'

export function App() {
  const [count, setCount] = useState<number>(0)

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
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      {modalRoot && createPortal(<div className="modal">I'm a modal</div>, modalRoot!)}
    </div>
  )
}
