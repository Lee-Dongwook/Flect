import { getCurrentFiber, getHookIndex } from '../model/hookContext'

export function useDeferredValue<T>(value: T): T {
  const fiber = getCurrentFiber()
  const index = getHookIndex()

  const prevHook = fiber.alternate?.memoizedState?.[index]
  const deferredValue = prevHook ?? value

  if (!fiber.memoizedState) fiber.memoizedState = []
  fiber.memoizedState[index] = deferredValue

  return deferredValue
}
