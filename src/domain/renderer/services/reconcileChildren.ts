import { VNode } from '../../vdom/model/vnode'
import { FiberNode, createFiberFromVNode } from '../../vdom/model/vnode'
import { Placement, Update, Deletion } from '../lib/flag'

export function reconcileChildren(parentFiber: FiberNode, children: VNode | VNode[]) {
  const oldFiber = parentFiber.alternate?.child ?? null
  const isArray = Array.isArray(children)
  const newChildren = isArray ? children : [children]

  let previousNewFiber: FiberNode | null = null
  let old = oldFiber

  newChildren.forEach((childVNode, index) => {
    if (childVNode == null || typeof childVNode === 'boolean') return

    let newFiber: FiberNode

    const sameType = old && old.type === childVNode.type
    if (sameType && old) {
      newFiber = {
        ...old,
        type: old.type,
        pendingProps: childVNode.props,
        flags: Update,
        return: parentFiber,
        index,
      }
    } else {
      if (old) {
        old.flags = Deletion
        // 실제로는 deletion queue에 넣어야 함
      }

      newFiber = createFiberFromVNode(childVNode)
      newFiber.flags = Placement
      newFiber.return = parentFiber
      newFiber.index = index
    }

    if (previousNewFiber) {
      previousNewFiber.sibling = newFiber
    } else {
      parentFiber.child = newFiber
    }

    previousNewFiber = newFiber
    if (old) old = old.sibling
  })

  while (old) {
    old.flags = Deletion
    old = old.sibling
  }
}
