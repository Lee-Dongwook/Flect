import { FiberNode } from './vnode'
import { flushLayoutEffects, flushEffects } from '../../hooks/model/effectQueue'
import { flushInsertionEffects } from '../../hooks/model/insertionEffectQueue'

const Placement = 1 << 0

export function commitWork(fiber: FiberNode) {
  if ((fiber.flags & Placement) !== 0) {
    const parentFiber = getHostParentFiber(fiber)
    if (parentFiber?.stateNode && fiber.stateNode) {
      parentFiber.stateNode.appendChild(fiber.stateNode)
    }
  }

  if (fiber.child) {
    commitWork(fiber.child)
  }

  if (fiber.sibling) {
    commitWork(fiber.sibling)
  }
}

export function commitRoot(rootFiber: FiberNode) {
  flushInsertionEffects()
  commitWork(rootFiber)
  flushLayoutEffects()
  flushEffects()
}

function getHostParentFiber(fiber: FiberNode): FiberNode | null {
  let parent = fiber.return
  while (parent && parent.stateNode === null) {
    parent = parent.return
  }
  return parent
}
