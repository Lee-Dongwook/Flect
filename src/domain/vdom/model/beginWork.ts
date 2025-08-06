import { createFiberFromVNode, FiberNode } from './vnode'

export function beginWork(fiber: FiberNode): FiberNode | null {
  const { type, pendingProps } = fiber

  if (typeof type === 'function') {
    const childrenVNode = type(pendingProps)
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
        const childFiber = createFiberFromVNode(childVNode)
        childFiber.return = fiber
        childFiber.index = index

        if (index === 0) {
          fiber.child = childFiber
        } else if (previousFiber) {
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
