import { getCurrentContext } from '../model/hookContext'
import { queueLayoutEffect } from '../model/effectQueue'

export function useImperativeHandle<T>(
  ref: { current: T | null } | null | undefined,
  create: () => T,
  deps: any[] = []
) {
  const ctx = getCurrentContext()
  if (!ctx) throw new Error('useImperativeHandle must be used within a render context')

  const index = ctx.hookIndex++
  const prevDeps = ctx.hooks[index]?.deps
  const hasChanged = !prevDeps || !deps.every((dep, i) => Object.is(dep, prevDeps[i]))

  if (hasChanged) {
    queueLayoutEffect(() => {
      if (ref != null) {
        ref.current = create()
      }
    })

    ctx.hooks[index] = { deps }
  }
}
