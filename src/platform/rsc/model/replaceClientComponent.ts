import { VNode } from '../../../domain/vdom/model/vnode'

export function replaceClientComponent(vnode: VNode): VNode {
  if (typeof vnode.type === 'function' && (vnode.type as any).__isClientComponent) {
    return {
      type: 'ClientPlaceholder',
      props: {
        id: (vnode.type as any).__clientId,
        props: vnode.props,
      },
    }
  }
  return vnode
}
