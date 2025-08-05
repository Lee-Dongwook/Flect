import { getCurrentContext } from '../model/hookContext'
import { queueLayoutEffect } from '../model/effectQueue'

export function useImperativeHandle<T>(
  ref: { current: T | null } | ((inst: T | null) => void) | null | undefined,
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
      const instance = create()

      if (typeof ref === 'function') {
        ref(instance)
      } else if (ref && 'current' in ref) {
        ref.current = instance
      }
      ctx.hooks[index] = { deps }
    })
  }
}
