import { App } from './components/App'
import { render } from '../domain/renderer/services/render'

const root = document.getElementById('root')!
render(<App />, root)
