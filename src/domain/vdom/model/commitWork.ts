import { FiberNode } from './vnode'

const Placement = 1 << 0

export function commitWork(fiber: FiberNode) {
  if (fiber.flags && Placement) {
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

function getHostParentFiber(fiber: FiberNode): FiberNode | null {
  let parent = fiber.return
  while (parent && parent.stateNode === null) {
    parent = parent.return
  }

  return parent
}
