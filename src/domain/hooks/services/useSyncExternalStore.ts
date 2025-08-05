import { getCurrentContext } from '../model/hookContext'
import { useEffect } from './useEffect'

export function useSyncExternalStore<T>(
  subscribe: (onStoreChange: () => void) => () => void,
  getSnapshot: () => T,
  getServerSnapshot?: () => T
): T {
  const ctx = getCurrentContext()
  if (!ctx) throw new Error('useSyncExternalStore must be used within a render context')

  const index = ctx.hookIndex++
  const isServer = typeof window === 'undefined'
  const snapshot = isServer && getServerSnapshot ? getServerSnapshot() : getSnapshot()

  if (!ctx.hooks[index]) {
    ctx.hooks[index] = { value: snapshot }
  }

  const state = ctx.hooks[index]

  if (state.value !== snapshot) {
    state.value = snapshot
  }

  useEffect(() => {
    function checkForUpdates() {
      const nextSnapshot = getSnapshot()
      if (nextSnapshot !== state.value) {
        state.value = nextSnapshot
        ctx?.rerender?.()
      }
    }

    const unsubscribe = subscribe(checkForUpdates)
    checkForUpdates()

    return unsubscribe
  }, [subscribe, getSnapshot])

  return state.value
}
