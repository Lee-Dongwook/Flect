import { getCurrentContext, setCurrentContext } from '../model/hookContext'
import { scheduleCallback, NormalPriority } from '../../../platform/scheduler'

export function useTransition(): [() => boolean, (callback: () => void) => void] {
  const ctx = getCurrentContext()
  if (!ctx) throw new Error('useTransition must be used within a render context')

  const index = ctx.hookIndex++

  if (!ctx.hooks[index]) {
    ctx.hooks[index] = { isPending: false }
  }

  const state = ctx.hooks[index]

  const startTransition = (callback: () => void) => {
    state.isPending = true

    scheduleCallback(NormalPriority, () => {
      try {
        setCurrentContext(ctx)
        callback()
      } finally {
        state.isPending = false
      }
    })
  }

  return [() => state.isPending, startTransition]
}
