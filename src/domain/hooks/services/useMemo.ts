import { getCurrentContext } from '../model/hookContext'

export function useMemo<T>(factory: () => T, deps: any[]): T {
  const ctx = getCurrentContext()
  if (!ctx) throw new Error('useMemo must be used within a render context')

  const index = ctx.hookIndex++

  const prev = ctx.hooks[index] as { deps: any[]; value: T } | undefined

  if (prev) {
    const hasChanged = !areDepsEqual(prev.deps, deps)
    if (!hasChanged) return prev.value
  }

  const value = factory()
  ctx.hooks[index] = { deps, value }
  return value
}

function areDepsEqual(prevDeps: any[], nextDeps: any[]) {
  if (prevDeps.length !== nextDeps.length) return false
  return prevDeps.every((dep, i) => Object.is(dep, nextDeps[i]))
}
