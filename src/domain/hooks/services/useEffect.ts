import { getCurrentContext } from '../model/hookContext'
import { queueEffect } from '../model/effectQueue'

export function useEffect(effect: () => void | (() => void), deps: any[] = []) {
  const ctx = getCurrentContext()
  if (!ctx) throw new Error('useEffect must be used within a render context')

  const index = ctx.hookIndex++
  const prev = ctx.hooks[index]
  const prevDeps = prev?.deps
  const hasChanged = !prevDeps || !deps.every((dep, i) => Object.is(dep, prevDeps[i]))

  // Initialize effects array if not exists
  if (!ctx.effects) {
    ctx.effects = []
  }

  // Register effect function for testing
  ctx.effects.push(() => {
    if (prev?.cleanup) prev.cleanup()
    const cleanup = effect()
    ctx.hooks[index] = { deps, cleanup }
  })

  // Queue effect for execution if dependencies changed
  if (hasChanged) {
    queueEffect(() => {
      if (prev?.cleanup) prev.cleanup()
      const cleanup = effect()
      ctx.hooks[index] = { deps, cleanup }
    })
  }
}
