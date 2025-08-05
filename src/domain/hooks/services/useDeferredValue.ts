import { getCurrentContext } from '../model/hookContext'
import { scheduleCallback, IdlePriority } from '../../../platform/scheduler'

export function useDeferredValue<T>(value: T): T {
  const ctx = getCurrentContext()
  if (!ctx) throw new Error('useDeferredValue must be used within a render context')

  const index = ctx.hookIndex++

  const hook = ctx.hooks[index] ?? { value, deferredValue: value }

  ctx.hooks[index] = hook

  if (value !== hook.value) {
    hook.value = value

    scheduleCallback(IdlePriority, () => {
      hook.deferredValue = hook.value
    })
  }
  return hook.deferredValue
}
