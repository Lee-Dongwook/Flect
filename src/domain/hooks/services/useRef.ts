import { getCurrentFiber, getHookIndex } from '../model/hookContext'

export function useRef<T>(initialValue: T): { current: T } {
  const fiber = getCurrentFiber()
  const index = getHookIndex()

  const prevHook = fiber.alternate?.memoizedState?.[index]
  const ref = prevHook ?? { current: initialValue }

  if (!fiber.memoizedState) fiber.memoizedState = []
  fiber.memoizedState[index] = ref

  return ref
}
