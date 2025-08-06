import { getCurrentContext } from '../model/hookContext'
import { triggerRerender } from './dispatcher'

export function useState<T>(initialValue: T): [T, (val: T | ((prev: T) => T)) => void] {
  const ctx = getCurrentContext()
  if (!ctx) throw new Error('useState must be used within a render context')

  const index = ctx.hookIndex++
  if (ctx.hooks.length <= index) {
    ctx.hooks[index] = initialValue
  }

  const setState = (newVal: T | ((prev: T) => T)) => {
    const currentValue = ctx.hooks[index]
    const nextValue =
      typeof newVal === 'function' ? (newVal as (prev: T) => T)(currentValue) : newVal
    ctx.hooks[index] = nextValue
    triggerRerender()
  }

  return [ctx.hooks[index], setState]
}
