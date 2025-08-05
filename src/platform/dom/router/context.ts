import { createContext } from ''

export const RouterContext = createContext<{ pathname: string }>({
  pathname: '/',
})
