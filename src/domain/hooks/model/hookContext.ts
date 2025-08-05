import type { VNode } from 'domain/vdom/model/vnode'

export interface HookContext {
  hooks: any[]
  hookIndex: number
  prevVNode: VNode | string | null
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

export function resetHookIndex() {
  if (currentContext) {
    currentContext.hookIndex = 0
  }
}
