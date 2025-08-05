import { getCurrentContext } from '../../../domain/hooks/model/hookContext'
import { registerStyle } from './registerStyle'

export function useStyle(styleObj: Record<string, any>): { className: string } {
  const ctx = getCurrentContext()
  if (!ctx) throw new Error('useStyle must be used within a render context')

  const index = ctx.hookIndex++
  if (!ctx.hooks[index]) {
    const className = registerStyle(styleObj)
    ctx.hooks[index] = { className }
  }

  return { className: ctx.hooks[index].className }
}
