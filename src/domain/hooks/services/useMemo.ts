import { getCurrentFiber, getHookIndex } from '../model/hookContext'

export function useMemo<T>(factory: () => T, deps: any[]): T {
  const fiber = getCurrentFiber()
  const index = getHookIndex()

  const prevHook = fiber.alternate?.memoizedState?.[index]
  const prevDeps = prevHook?.deps
  const prevValue = prevHook?.value

  let hasChanged = true
  if (prevDeps) {
    hasChanged = deps.some((dep, i) => !Object.is(dep, prevDeps[i]))
  }

  const value = hasChanged ? factory() : prevValue

  if (!fiber.memoizedState) fiber.memoizedState = []
  fiber.memoizedState[index] = { deps, value }

  return value
}
