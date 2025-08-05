import { getCurrentContext } from '../model/hookContext'
import type { Context } from './createContext'

export function useContext<T>(context: Context<T>): T {
  const ctx = getCurrentContext()
  if (!ctx) throw new Error('useContext must be used within a render context')
  return context.value
}
