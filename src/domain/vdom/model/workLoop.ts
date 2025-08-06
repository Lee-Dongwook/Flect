import { FiberNode } from './vnode'
import { beginWork } from './beginWork'
import { completeWork } from './completeWork'
import { commitRoot } from './commitWork'

let workInProgress: FiberNode | null = null

export function scheduleUpdateOnFiber(rootFiber: FiberNode) {
  workInProgress = rootFiber
  workLoop()
  commitRoot(rootFiber)
}

function workLoop() {
  while (workInProgress) {
    workInProgress = performUnitOfWork(workInProgress)
  }
}

function performUnitOfWork(fiber: FiberNode): FiberNode | null {
  const next = beginWork(fiber)

  if (next) {
    return next
  }

  let current: FiberNode | null = fiber

  while (current) {
    completeWork(current)

    if (current.sibling) {
      return current.sibling
    }

    current = current.return
  }

  return null
}
