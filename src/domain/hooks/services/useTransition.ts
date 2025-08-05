import { getCurrentContext } from '../model/hookContext'
import { scheduleCallback } from '../../../domain/transitions/model/scheduler'
import { setTransitionContext } from '../../../domain/transitions/model/transitionContext'

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

    setTransitionContext({
      isPending: true,
      startTransition,
    })

    scheduleCallback(() => {
      try {
        callback()
      } finally {
        state.isPending = false
      }
    })
  }
  return [() => state.isPending, startTransition]
}
