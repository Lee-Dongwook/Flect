import type { VNode } from '../../vdom/model/vnode'
import { h } from '../../vdom/services/createVNode'

export function render(vnode: VNode | string, container: HTMLElement) {
  if (typeof vnode === 'string') {
    container.appendChild(document.createTextNode(vnode))
    return
  }

  if (typeof vnode.type === 'function') {
    const childVNode = (vnode.type as Function)(vnode.props ?? {})
    render(childVNode, container)
    return
  }

  const el = document.createElement(vnode.type as string)

  if (vnode.props) {
    Object.entries(vnode.props).forEach(([key, value]) => {
      el.setAttribute(key, value)
    })
  }

  vnode.children.forEach((child) => render(child, el))
  container.appendChild(el)
}
