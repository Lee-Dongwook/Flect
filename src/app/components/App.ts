import { h } from '../../domain/vdom/services/createVNode'

export function App() {
  return h('div', { id: 'app' }, 'Hello from Flect!')
}
