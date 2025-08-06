import { getCurrentFiber, getHookIndex } from '../model/hookContext'
import type { Context } from './createContext'

export function useContext<T>(context: Context<T>): T {
  const fiber = getCurrentFiber()
  const index = getHookIndex()

  // Context value is stored in fiber's memoizedState
  const prevHook = fiber.alternate?.memoizedState?.[index]
  const contextValue = prevHook ?? context.value

  if (!fiber.memoizedState) fiber.memoizedState = []
  fiber.memoizedState[index] = contextValue

  return contextValue
}
