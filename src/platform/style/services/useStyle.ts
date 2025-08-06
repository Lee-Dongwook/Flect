import { getCurrentFiber, getHookIndex } from '../../../domain/hooks/model/hookContext'
import { registerStyle } from './registerStyle'
import { injectStyle } from './injectStyle'

export function useStyle(css: string): string {
  const fiber = getCurrentFiber()
  const index = getHookIndex()

  const prevHook = fiber.alternate?.memoizedState?.[index]
  const className = prevHook ?? registerStyle(css)

  if (!fiber.memoizedState) fiber.memoizedState = []
  fiber.memoizedState[index] = className

  injectStyle(css, className)
  return className
}
