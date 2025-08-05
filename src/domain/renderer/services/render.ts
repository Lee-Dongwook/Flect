import type { VNode } from '../../vdom/model/vnode'
import { type HookContext, setCurrentContext, resetHookIndex } from '../../hooks/model/hookContext'
import { setRenderTarget } from '../../hooks/services/dispatcher'
import { isRendering, pushRenderContext, popRenderContext } from '../model/renderContext'

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
    if (isRendering(node.type)) {
      throw new Error(`Infinite render loop detected: <${node.type.name}>`)
    }

    const ctx: HookContext = { hooks: [], hookIndex: 0 }

    function rerender() {
      container.innerHTML = ''
      setCurrentContext(ctx)
      resetHookIndex()

      pushRenderContext(node.type as Function)

      const nextVNode = (node.type as Function)(node.props ?? {})

      popRenderContext()

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

  if (node.children && Array.isArray(node.children)) {
    node.children.forEach((child) => {
      if (child !== undefined && child !== null) {
        render(child, el)
      }
    })
  }

  container.appendChild(el)
}
