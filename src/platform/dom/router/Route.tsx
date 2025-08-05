import { useContext } from '../../../domain/hooks/services/useContext'
import { RouterContext } from './context'

interface RouteProps {
  path: string
  component: () => JSX.Element
}

interface RouteResult {
  pathname: string
}

export function Route({ path, component: Component }: RouteProps) {
  const { pathname } = useContext<RouteResult>(RouterContext)

  if (pathname === path) {
    return <Component />
  }
  return null
}
