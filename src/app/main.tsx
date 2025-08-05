import { App } from './components/App'
import { createRoot } from '../platform/dom/createRoot'

const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(<App />)
}
