import { createFiberFromVNode, FiberNode } from './vnode'
import { prepareToUseHooks, resetHooks } from '../../hooks/model/hookContext'

export function beginWork(fiber: FiberNode): FiberNode | null {
  const { type, pendingProps } = fiber

  if (typeof type === 'function') {
    prepareToUseHooks(fiber)
    const childrenVNode = type(pendingProps)
    resetHooks()

    if (!childrenVNode || typeof childrenVNode === 'boolean') return null

    const childFiber = createFiberFromVNode(childrenVNode)
    childFiber.return = fiber
    fiber.child = childFiber
    return childFiber
  }

  if (typeof type === 'string') {
    const children = pendingProps?.children

    if (Array.isArray(children)) {
      let previousFiber: FiberNode | null = null

      children.forEach((childVNode, index) => {
        if (childVNode == null || typeof childVNode === 'boolean') return

        const childFiber = createFiberFromVNode(childVNode)
        childFiber.return = fiber
        childFiber.index = index

        if (previousFiber === null) {
          fiber.child = childFiber
        } else {
          previousFiber.sibling = childFiber
        }

        previousFiber = childFiber
      })
    } else if (children != null && typeof children !== 'boolean') {
      const childFiber = createFiberFromVNode(children)
      childFiber.return = fiber
      fiber.child = childFiber
    }

    return fiber.child
  }

  return null
}
