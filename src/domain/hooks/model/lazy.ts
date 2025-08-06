import type { VNode } from '../../vdom/model/vnode'

interface LazyComponent<T = any> {
  (): Promise<{ default: (props: T) => VNode }>
  _status: 'uninitialized' | 'pending' | 'resolved' | 'rejected'
  _result: any
}

export function lazy<T>(loader: () => Promise<{ default: (props: T) => VNode }>): LazyComponent<T> {
  const lazyComp: LazyComponent<T> = function () {
    if (lazyComp._status === 'uninitialized') {
      const promise = loader()
      lazyComp._status = 'pending'
      lazyComp._result = promise
      promise.then(
        (mod) => {
          if (lazyComp._status === 'pending') {
            lazyComp._status = 'resolved'
            lazyComp._result = mod.default
          }
        },
        (err) => {
          if (lazyComp._status === 'pending') {
            lazyComp._status = 'rejected'
            lazyComp._result = err
          }
        }
      )
    }

    if (lazyComp._status === 'resolved') {
      return lazyComp._result.apply(null, arguments)
    }

    throw lazyComp._result
  }

  lazyComp._status = 'uninitialized'
  lazyComp._result = null
  return lazyComp
}
