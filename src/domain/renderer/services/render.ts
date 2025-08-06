import type { VNode } from '../../vdom/model/vnode'
import { reconcile } from './reconcile'
import { type HookContext, setCurrentContext, resetHookIndex } from '../../hooks/model/hookContext'
import { setRenderTarget } from '../../hooks/services/dispatcher'
import {
  isRendering,
  pushRenderContext,
  popRenderContext,
  getRenderStack,
} from '../model/renderContext'
import { flushLayoutEffects, flushEffects } from '../../../domain/hooks/model/effectQueue'
import { flushInsertionEffects } from '../../../domain/hooks/model/insertionEffectQueue'
import { applyStyle } from '../../../platform/dom/services/applyProps/style'
import { isErrorBoundary } from '../../../shared/isErrorBoundary'
import { errorBoundaryContexts } from '../../../platform/error/view/ErrorBoundary'

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
        flushInsertionEffects()
        flushLayoutEffects()
        flushEffects()
      }
    } catch (error) {
      // 에러가 발생했을 때 ErrorBoundary 처리
      const errorBoundary = findNearestErrorBoundary(component)
      if (errorBoundary) {
        handleErrorBoundaryError(errorBoundary, error as Error, container)
      } else {
        // ErrorBoundary가 없으면 에러를 다시 던짐
        throw error
      }
    } finally {
      popRenderContext()
    }
  }

  setRenderTarget(rerender)
  rerender()
}

function findNearestErrorBoundary(component: Function): Function | null {
  // 현재 컴포넌트가 ErrorBoundary인지 확인
  if (isErrorBoundary(component)) {
    return component
  }

  // 렌더링 스택에서 가장 가까운 ErrorBoundary 찾기
  const renderStack = getRenderStack()
  for (let i = renderStack.length - 1; i >= 0; i--) {
    const stackComponent = renderStack[i]
    if (isErrorBoundary(stackComponent)) {
      return stackComponent
    }
  }

  return null
}

function handleErrorBoundaryError(errorBoundary: Function, error: Error, container: HTMLElement) {
  const errorCtx = errorBoundaryContexts.get(errorBoundary)
  if (!errorCtx) {
    console.error('ErrorBoundary context not found')
    return
  }

  errorCtx.error = error

  // fallback 렌더링
  const fallback = typeof errorCtx.fallback === 'function' ? errorCtx.fallback() : errorCtx.fallback

  render(fallback, container, true)
}

function renderElement(vnode: VNode, container: HTMLElement) {
  const el = document.createElement(vnode.type as string)

  for (const [key, value] of Object.entries(vnode.props ?? {})) {
    if (key === 'children') continue
    if (key === 'style' && typeof value === 'object') {
      applyStyle(el, value)
    } else if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value)
    } else if (key !== 'children') {
      el.setAttribute(key, String(value))
    }
  }

  const children = vnode.props?.children ?? []

  for (const child of children) {
    if (child === null) throw new Error(`${child} is null`)
    if (typeof child === 'string' || typeof child === 'number' || typeof child === 'boolean') {
      el.appendChild(document.createTextNode(String(child)))
    } else if (child !== undefined && child !== null) {
      render(child, el, false)
    }
  }

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
