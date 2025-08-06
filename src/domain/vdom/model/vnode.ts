export interface VNode {
  type: string | Function
  key?: string | null
  ref?: any
  props: {
    [key: string]: any
    children?: Array<VNode | string | number | boolean | null>
  }
}

export interface FiberNode {
  type: any
  key: null | string
  ref: any
  stateNode: any
  return: FiberNode | null
  child: FiberNode | null
  sibling: FiberNode | null
  alternate: FiberNode | null

  pendingProps: any
  memoizedProps: any
  memoizedState: any

  flags: number
  index: number
}

export function createFiberFromVNode(vnode: VNode): FiberNode {
  const { type, key = null, ref = null, props } = vnode

  return {
    type,
    key,
    ref,
    stateNode: null,

    return: null,
    child: null,
    sibling: null,
    alternate: null,

    pendingProps: props,
    memoizedProps: null,
    memoizedState: null,

    flags: 0,
    index: 0,
  }
}
