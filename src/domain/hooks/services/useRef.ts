import { getCurrentContext } from '../model/hookContext'

export function useRef<T>(initialValue: T): { current: T } {
  const ctx = getCurrentContext()
  if (!ctx) throw new Error('useRef must be used within a render context')

  const index = ctx.hookIndex++
  if (!ctx.hooks[index]) {
    ctx.hooks[index] = { current: initialValue }
  }

  return ctx.hooks[index]
}
