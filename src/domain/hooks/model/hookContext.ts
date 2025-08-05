export interface HookContext {
  hooks: any[]
  hookIndex: number
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
