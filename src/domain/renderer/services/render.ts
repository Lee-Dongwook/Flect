import type { VNode } from '../../vdom/model/vnode'
import { type HookContext, setCurrentContext, resetHookIndex } from '../../hooks/model/hookContext'
import { setRenderTarget } from '../../hooks/services/dispatcher'

export function render(vnode: VNode | string, container: HTMLElement) {
  if (!vnode) {
    console.warn('render: vnode is undefined or null')
    return
  }

  if (typeof vnode === 'string') {
    container.appendChild(document.createTextNode(vnode))
    return
  }

  const node = vnode as VNode

  if (typeof node.type === 'function') {
    const ctx: HookContext = { hooks: [], hookIndex: 0 }

    function rerender() {
      container.innerHTML = ''
      setCurrentContext(ctx)
      resetHookIndex()
      const nextVNode = (node.type as Function)(node.props ?? {})
      render(nextVNode, container)
    }

    setRenderTarget(rerender)
    rerender()
    return
  }

  const el = document.createElement(node.type as string)

  if (node.props) {
    for (const [key, value] of Object.entries(node.props)) {
      if (key.startsWith('on') && typeof value === 'function') {
        el.addEventListener(key.slice(2).toLowerCase(), value)
      } else if ((key !== 'children' && typeof value === 'string') || typeof value === 'number') {
        el.setAttribute(key, String(value))
      }
    }
  }

  if (vnode.children && Array.isArray(vnode.children)) {
    vnode.children.forEach((child) => {
      if (child !== undefined && child !== null) {
        render(child, el)
      }
    })
  }
  container.appendChild(el)
}
