import { createFiberFromVNode, type VNode } from '../../vdom/model/vnode'
import { scheduleUpdateOnFiber } from '../../vdom/model/workLoop'

export function render(vnode: VNode | string | number | boolean, container: HTMLElement) {
  if (!vnode) {
    console.warn('render: vnode is undefined or null')
    return
  }

  const rootFiber = createFiberFromVNode(vnode as VNode)
  rootFiber.stateNode = container

  scheduleUpdateOnFiber(rootFiber)
}
