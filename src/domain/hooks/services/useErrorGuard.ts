import { useState } from './useState'

export function useErrorGuard(): [Error | null, (fn: () => any) => any] {
  const [error, setError] = useState<Error | null>(null)

  function execute(fn: () => any): any {
    try {
      return fn()
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)))
      return null
    }
  }

  return [error, execute]
}
