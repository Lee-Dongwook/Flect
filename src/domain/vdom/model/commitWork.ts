import { FiberNode } from './vnode'
import { flushLayoutEffects, flushEffects } from '../../hooks/model/effectQueue'
import { flushInsertionEffects } from '../../hooks/model/insertionEffectQueue'
import { Placement, Update, Deletion } from '../../renderer/lib/flag'
import { updateDomProperties } from '../../../platform/dom/helpers/updateDomProperties'
import { commitRef } from '../../renderer/services/commitRef'

export function commitWork(fiber: FiberNode) {
  if ((fiber.flags & Placement) !== 0) {
    const parentFiber = getHostParentFiber(fiber)
    if (parentFiber?.stateNode && fiber.stateNode) {
      parentFiber.stateNode.appendChild(fiber.stateNode)
    }
  }

  if ((fiber.flags & Update) !== 0) {
    updateDomProperties(fiber.stateNode, fiber.memoizedProps || {}, fiber.pendingProps || {})
  }

  if ((fiber.flags & Deletion) !== 0) {
    const parentFiber = getHostParentFiber(fiber)
    if (parentFiber?.stateNode && fiber.stateNode) {
      parentFiber.stateNode.removeChild(fiber.stateNode)
    }
    return
  }

  if (fiber.child) {
    commitWork(fiber.child)
  }

  if (fiber.sibling) {
    commitWork(fiber.sibling)
  }

  commitRef(fiber)
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
