export function useDebugValue<T>(value: T, formatter?: (value: T) => any): void {
  if (process.env.NODE_ENV !== 'production') {
    const display = formatter ? formatter(value) : value
    console.debug('useDebugValue:', display)
  }
}
