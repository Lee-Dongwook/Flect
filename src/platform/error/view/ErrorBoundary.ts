import { VNode } from '../../../domain/vdom/model/vnode'
import { useErrorGuard } from '../../../domain/hooks/services/useErrorGuard'
import { isErrorBoundary } from '../../../shared/isErrorBoundary'

interface ErrorBoundaryProps {
  fallback: VNode | (() => VNode)
  children: () => VNode
}

export function ErrorBoundary({ fallback, children }: ErrorBoundaryProps): VNode {
  const [error, execute] = useErrorGuard()

  // ErrorBoundary 컨텍스트에 fallback 등록
  if (!errorBoundaryContexts.has(ErrorBoundary)) {
    errorBoundaryContexts.set(ErrorBoundary, { error: null, fallback })
  }

  if (error) {
    return typeof fallback === 'function' ? fallback() : fallback
  }

  try {
    const vnode = execute(children)
    return vnode ?? { type: 'div', props: { children: 'Error occurred.' } }
  } catch (e) {
    // 에러가 발생하면 fallback 렌더링
    return typeof fallback === 'function' ? fallback() : fallback
  }
}

ErrorBoundary.__isErrorBoundary = true

// errorBoundaryContexts를 export하여 render.ts에서 사용할 수 있도록 함
export const errorBoundaryContexts = new WeakMap<
  Function,
  { error: Error | null; fallback: VNode | (() => VNode) }
>()
