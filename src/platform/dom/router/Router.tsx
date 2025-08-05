import { useState } from '../../../domain/hooks/services/useState'
import { RouterContext } from './context'

export function Router({ children }: { children: any }) {
  const [pathname, setPathname] = useState(window.location.pathname)

  // TODO: useEffect

  return <RouterContext.Provider value={{ pathname }}>{children}</RouterContext.Provider>
}
