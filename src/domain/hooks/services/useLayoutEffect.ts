import { getCurrentContext } from '../model/hookContext'
import { queueLayoutEffect } from '../model/effectQueue'

export function useLayoutEffect(effect: () => void | (() => void), deps: any[] = []) {
  const ctx = getCurrentContext()
  if (!ctx) throw new Error('useLayoutEffect must be used within a render context')

  const index = ctx.hookIndex++
  const prevDeps = ctx.hooks[index]?.deps
  const hasChanged = !prevDeps || !deps.every((dep, i) => Object.is(dep, prevDeps[i]))

  if (hasChanged) {
    queueLayoutEffect(() => {
      const cleanup = effect()
      ctx.hooks[index] = { deps, cleanup }
    })
  }
}
