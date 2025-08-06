import { getCurrentFiber, getHookIndex } from '../model/hookContext'
import { queueInsertionEffect } from '../model/insertionEffectQueue'

export function useInsertionEffect(effect: () => void | (() => void), deps: any[]) {
  const fiber = getCurrentFiber()
  const index = getHookIndex()

  const prevHook = fiber.alternate?.memoizedState?.[index]
  const prevDeps = prevHook?.deps

  let hasChanged = true
  if (prevDeps) {
    hasChanged = deps.some((dep, i) => !Object.is(dep, prevDeps[i]))
  }

  const hook = {
    deps,
    effect,
    cleanup: null as (() => void) | null,
  }

  if (!fiber.memoizedState) fiber.memoizedState = []
  fiber.memoizedState[index] = hook

  if (hasChanged) {
    queueInsertionEffect(() => {
      if (hook.cleanup) hook.cleanup()
      const cleanup = effect()
      if (typeof cleanup === 'function') {
        hook.cleanup = cleanup
      }
    })
  }
}
