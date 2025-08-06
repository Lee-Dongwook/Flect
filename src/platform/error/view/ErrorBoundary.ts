import { VNode } from '../../../domain/vdom/model/vnode'
import { useErrorGuard } from '../../../domain/hooks/services/useErrorGuard'

interface ErrorBoundaryProps {
  fallback: VNode | (() => VNode)
  children: () => VNode
}

export function ErrorBoundary({ fallback, children }: ErrorBoundaryProps): VNode {
  const [error, execute] = useErrorGuard()

  if (error) {
    return typeof fallback === 'function' ? fallback() : fallback
  }

  const vnode = execute(children)
  return vnode ?? { type: 'div', props: { children: 'Error occurred.' } }
}

ErrorBoundary.__isErrorBoundary = true
