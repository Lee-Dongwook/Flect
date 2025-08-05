import { h } from '../../domain/vdom/services/createVNode'
import { useState } from '../../domain/hooks/services/useState'

export function App() {
  const [count, setCount] = useState<number>(0)

  return h(
    'div',
    null,
    h('h1', null, `Count: ${count}`),
    h('button', { onclick: () => setCount(count + 1) }, 'Increment')
  )
}
