import { getCurrentFiber, getHookIndex } from '../model/hookContext'

export function useId(): string {
  const fiber = getCurrentFiber()
  const index = getHookIndex()

  const prevHook = fiber.alternate?.memoizedState?.[index]
  const id = prevHook ?? `flect-${Math.random().toString(36).substr(2, 9)}`

  if (!fiber.memoizedState) fiber.memoizedState = []
  fiber.memoizedState[index] = id

  return id
}
