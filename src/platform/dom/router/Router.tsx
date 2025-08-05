import { useState } from '../../../domain/hooks/services/useState'
import { useEffect } from '../../../domain/hooks/services/useEffect'
import { RouterContext } from './context'

export function Router({ children }: { children: any }) {
  const [pathname, setPathname] = useState(window.location.pathname)

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  return <RouterContext.Provider value={{ pathname }}>{children}</RouterContext.Provider>
}
