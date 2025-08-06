import { getCurrentFiber, getHookIndex } from '../model/hookContext'

export function useImperativeHandle<T, R extends T>(
  ref: { current: T | null } | ((instance: T | null) => void) | null,
  init: () => R,
  deps?: ReadonlyArray<any>
): void {
  const fiber = getCurrentFiber()
  const index = getHookIndex()

  const prevHook = fiber.alternate?.memoizedState?.[index]
  const prevDeps = prevHook?.deps

  let hasChanged = true
  if (prevDeps && deps) {
    hasChanged = deps.some((dep, i) => !Object.is(dep, prevDeps[i]))
  }

  const hook = {
    deps,
    ref,
    init,
  }

  if (!fiber.memoizedState) fiber.memoizedState = []
  fiber.memoizedState[index] = hook

  if (hasChanged && ref) {
    if (typeof ref === 'function') {
      ref(init())
    } else {
      ref.current = init()
    }
  }
}
