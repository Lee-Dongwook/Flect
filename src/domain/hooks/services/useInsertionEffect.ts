import { getCurrentContext } from '../model/hookContext'
import { queueInsertionEffect } from '../model/insertionEffectQueue'

export function useInsertionEffect(effect: () => void | (() => void), deps: any[] = []) {
  const ctx = getCurrentContext()
  if (!ctx) throw new Error('useInsertionEffect must be used within a render context')

  const index = ctx.hookIndex++
  const prevDeps = ctx.hooks[index]?.deps
  const hasChanged = !prevDeps || !deps.every((dep, i) => Object.is(dep, prevDeps[i]))

  if (hasChanged) {
    queueInsertionEffect(() => {
      const cleanup = effect()
      ctx.hooks[index] = { deps, cleanup }
    })
  }
}
