import type { VNode } from '../../vdom/model/vnode'

interface SuspenseProps {
  fallback: VNode | string
  children: VNode
}

export function Suspense({ fallback, children }: SuspenseProps): VNode {
  try {
    return children
  } catch (promiseOrError) {
    if (promiseOrError instanceof Promise) {
      return typeof fallback === 'string'
        ? { type: 'div', props: { children: [fallback] } }
        : fallback
    }

    throw promiseOrError
  }
}
