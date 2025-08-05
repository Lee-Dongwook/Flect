import { getCurrentContext } from '../model/hookContext'

export function useEffect(effect: () => void | (() => void), deps: any[] = []) {
  const ctx = getCurrentContext()
  if (!ctx) throw new Error('useEffect must be used within a render context')

  const index = ctx.hookIndex++
  const prevDeps = ctx.hooks[index]?.deps
  const hasChanged = !prevDeps || !deps.every((dep, i) => Object.is(dep, prevDeps[i]))

  if (hasChanged) {
    ctx.effects = ctx.effects || []
    ctx.effects.push(() => {
      const cleanup = effect()
      ctx.hooks[index] = { deps, cleanup }
    })
  }
}
