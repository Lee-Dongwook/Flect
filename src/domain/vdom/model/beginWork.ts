import { FiberNode } from './vnode'
import { prepareToUseHooks, resetHooks } from '../../hooks/model/hookContext'
import { reconcileChildren } from '../../renderer/services/reconcileChildren'

export function beginWork(fiber: FiberNode): FiberNode | null {
  const { type, pendingProps } = fiber

  if (typeof type === 'function') {
    prepareToUseHooks(fiber)
    const childrenVNode = type(pendingProps)
    resetHooks()

    if (!childrenVNode || typeof childrenVNode === 'boolean') return null
    reconcileChildren(fiber, childrenVNode)
    return fiber.child
  }

  if (typeof type === 'string') {
    reconcileChildren(fiber, pendingProps?.children)
    return fiber.child
  }

  return null
}
