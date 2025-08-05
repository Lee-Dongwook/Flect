import { getCurrentContext } from '../model/hookContext'
import { triggerRerender } from './dispatcher'

export function useState<T>(initialValue: T): [T, (val: T) => void] {
  const ctx = getCurrentContext()
  if (!ctx) throw new Error('useState must be used within a render context')

  const index = ctx.hookIndex++
  if (ctx.hooks.length <= index) {
    ctx.hooks[index] = initialValue
  }

  const setState = (newVal: T) => {
    ctx.hooks[index] = newVal
    triggerRerender()
  }

  return [ctx.hooks[index], setState]
}
