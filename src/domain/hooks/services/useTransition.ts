import { getCurrentFiber, getHookIndex } from '../model/hookContext'
import { scheduleCallback, NormalPriority } from '../../../platform/scheduler'

export function useTransition(): [() => boolean, (callback: () => void) => void] {
  const fiber = getCurrentFiber()
  const index = getHookIndex()

  const prevHook = fiber.alternate?.memoizedState?.[index]
  const hook = prevHook ?? { isPending: false }

  if (!fiber.memoizedState) fiber.memoizedState = []
  fiber.memoizedState[index] = hook

  const startTransition = (callback: () => void) => {
    hook.isPending = true

    scheduleCallback(NormalPriority, () => {
      try {
        callback()
      } finally {
        hook.isPending = false
      }
    })
  }

  return [() => hook.isPending, startTransition]
}
