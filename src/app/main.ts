import { h } from '../domain/vdom/services/createVNode'
import { render } from '../domain/renderer/services/render'
import { App } from './components/App'

const root = document.getElementById('root')!
render(h(App, null), root)
