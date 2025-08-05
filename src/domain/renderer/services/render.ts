import type { VNode } from '../../vdom/model/vnode'
import { reconcile } from './reconcile'
import { type HookContext, setCurrentContext, resetHookIndex } from '../../hooks/model/hookContext'
import { setRenderTarget } from '../../hooks/services/dispatcher'
import { isRendering, pushRenderContext, popRenderContext } from '../model/renderContext'

const componentContexts = new WeakMap<Function, HookContext>()

function renderComponent(vnode: VNode, container: HTMLElement) {
  const component = vnode.type as Function
  const ctx: HookContext = componentContexts.get(component) ?? {
    hooks: [],
    hookIndex: 0,
    prevVNode: null,
  }

  componentContexts.set(component, ctx)

  function rerender() {
    setCurrentContext(ctx)
    resetHookIndex()
    pushRenderContext(component)

    try {
      const nextVNode = component(vnode.props ?? {})

      const shouldSkip = ctx.prevVNode && reconcile(ctx.prevVNode, nextVNode)
      ctx.prevVNode = nextVNode

      if (!shouldSkip) {
        render(nextVNode, container, true)
      }
    } finally {
      popRenderContext()
    }
  }

  setRenderTarget(rerender)
  rerender()
}

function renderElement(vnode: VNode, container: HTMLElement) {
  const el = document.createElement(vnode.type as string)

  for (const [key, value] of Object.entries(vnode.props ?? {})) {
    if (key === 'children') continue
    if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value)
    } else if (key !== 'children') {
      el.setAttribute(key, String(value))
    }
  }

  const children = vnode.props?.children ?? []

  children.forEach((child) => {
    console.log('Rendering child:', child)
    if (child === null) throw new Error(`${child} is null`)

    if (typeof child === 'string' || typeof child === 'number' || typeof child === 'boolean') {
      el.appendChild(document.createTextNode(String(child)))
    } else if (child !== undefined && child !== null) {
      render(child, el, false)
    }
  })

  container.appendChild(el)
}

export function render(
  vnode: VNode | string | number | boolean,
  container: HTMLElement,
  isRoot = true
) {
  if (!vnode) {
    console.warn('render: vnode is undefined or null')
    return
  }

  if (isRoot) container.innerHTML = ''

  if (typeof vnode === 'string' || typeof vnode === 'number' || typeof vnode === 'boolean') {
    container.appendChild(document.createTextNode(String(vnode)))
    return
  }

  const node = vnode as VNode

  if (typeof node.type === 'function') {
    if (isRendering(node.type)) {
      throw new Error(`Infinite render loop detected: <${node.type.name}>`)
    }
    renderComponent(node, container)
  } else {
    renderElement(node, container)
  }
}
