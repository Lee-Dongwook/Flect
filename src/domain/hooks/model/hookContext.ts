import type { FiberNode } from '../../vdom/model/vnode'

let currentlyRenderingFiber: FiberNode | null = null
let hookIndex = 0

export interface HookContext {
  hooks: any[]
  hookIndex: number
  prevVNode: FiberNode | string | null
  effects?: Array<() => void>
  layoutEffects?: Array<() => void>
  insertionEffects?: Array<() => void>
  rerender?: () => void
  isServer?: boolean
}

let currentContext: HookContext | null = null

export function getCurrentContext() {
  return currentContext
}

export function setCurrentContext(ctx: HookContext) {
  currentContext = ctx
}

export function prepareToUseHooks(fiber: FiberNode) {
  currentlyRenderingFiber = fiber
  hookIndex = 0
}

export function getCurrentFiber(): FiberNode {
  if (!currentlyRenderingFiber) {
    throw new Error('Hooks can only be called inside a function component')
  }
  return currentlyRenderingFiber
}

export function getHookIndex(): number {
  return hookIndex++
}

export function resetHooks() {
  currentlyRenderingFiber = null
  hookIndex = 0
}
