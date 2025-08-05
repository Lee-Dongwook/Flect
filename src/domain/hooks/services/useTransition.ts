import { getCurrentContext } from '../model/hookContext'

let isPending: boolean = false
let pendingCallback: (() => void) | null = null

export function useTransition(): [boolean, (callback: () => void) => void] {
  const ctx = getCurrentContext()
  if (!ctx) throw new Error('useTransition must be used within a render context')

  const index = ctx.hookIndex++

  if (!ctx.hooks[index]) {
    ctx.hooks[index] = {}
  }

  const startTransition = (callback: () => void) => {
    isPending = true
    pendingCallback = callback

    Promise.resolve().then(() => {
      if (pendingCallback) {
        pendingCallback()
        pendingCallback = null
      }
      isPending = false
    })
  }
  return [isPending, startTransition]
}
