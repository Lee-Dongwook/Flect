export interface Context<T> {
  Provider: (props: { value: T; children: any }) => any
  value: T
}

export function createContext<T>(defaultValue: T): Context<T> {
  const context: Context<T> = {
    value: defaultValue,
    Provider: ({ value, children }) => {
      context.value = value
      return children
    },
  }
  return context
}
