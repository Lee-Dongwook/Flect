import { FiberNode } from '../../vdom/model/vnode'

export function commitRef(fiber: FiberNode) {
  const ref = fiber.ref
  if (ref != null) {
    if (typeof ref === 'function') {
      ref(fiber.stateNode)
    } else {
      ref.current = fiber.stateNode
    }
  }
}
