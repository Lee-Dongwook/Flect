import type { VNode } from '../../domain/vdom/model/vnode'
import { render as internalRender } from '../../domain/renderer/services/render'

export function render(vnode: VNode | string, container: HTMLElement) {
  container.innerHTML = ''
  internalRender(vnode, container)
}
