import { useState } from '../../domain/hooks/services/useState'
import { createPortal } from '../../platform/dom/createPortal'

const modalRoot = document.getElementById('modal-root')

export function App() {
  const [count, setCount] = useState<number>(0)

  return (
    <div id="app">
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      {createPortal(<div className="modal">I'm a modal</div>, modalRoot!)}
    </div>
  )
}
