import { createContext } from '../../../domain/hooks/services/createContext'

export const RouterContext = createContext<{ pathname: string }>({
  pathname: '/',
})
