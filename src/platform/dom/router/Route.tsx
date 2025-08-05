import { RouterContext } from './context'

interface RouteProps {
  path: string
  component: () => JSX.Element
}

export function Route({ path, component: Component }: RouteProps) {
  const { pathname } = useContext(RouterContext)

  if (pathname === path) {
    return <Component />
  }
  return null
}
