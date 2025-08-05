import { getCurrentContext } from '../model/hookContext'

let globalIdCounter = 0

export function useId(): string {
  const ctx = getCurrentContext()
  if (!ctx) throw new Error('useId must be used within a render context')

  const index = ctx.hookIndex++

  if (!ctx.hooks[index]) {
    const newId = `uid-${globalIdCounter++}`
    ctx.hooks[index] = { id: newId }
  }

  return ctx.hooks[index].id
}
