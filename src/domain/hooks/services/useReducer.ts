import { getCurrentContext } from '../model/hookContext'
import { triggerRerender } from './dispatcher'

export function useReducer<R, S, A = any>(
  reducer: (state: S, action: A) => S,
  initialState: S
): [S, (action: A) => void] {
  const ctx = getCurrentContext()
  if (!ctx) throw new Error('useReducer must be used within a render context')

  const index = ctx.hookIndex++

  if (ctx.hooks.length <= index) {
    ctx.hooks[index] = initialState
  }

  const dispatch = (action: A) => {
    const prevState = ctx.hooks[index]
    const nextState = reducer(prevState, action)
    ctx.hooks[index] = nextState
    triggerRerender()
  }

  return [ctx.hooks[index], dispatch]
}
