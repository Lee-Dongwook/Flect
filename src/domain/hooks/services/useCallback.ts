import { useMemo } from './useMemo'

export function useCallback<T extends (...args: any[]) => any>(cb: T, deps: any[]): T {
  return useMemo(() => cb, deps)
}
