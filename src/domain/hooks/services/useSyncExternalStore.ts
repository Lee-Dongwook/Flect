import { getCurrentFiber, getHookIndex } from '../model/hookContext'

export function useSyncExternalStore<T>(
  subscribe: (callback: () => void) => () => void,
  getSnapshot: () => T
): T {
  const fiber = getCurrentFiber()
  const index = getHookIndex()

  const prevHook = fiber.alternate?.memoizedState?.[index]
  const snapshot = prevHook ?? getSnapshot()

  if (!fiber.memoizedState) fiber.memoizedState = []
  fiber.memoizedState[index] = snapshot

  return snapshot
}
