import { useMemo } from './useMemo'

export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: unknown[]): T {
  return useMemo(() => callback, deps)
}
