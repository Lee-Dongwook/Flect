import type { VNode } from '../../domain/vdom/model/vnode'

interface HostConfigProps {
  createInstance: (type: string, props: any) => void
  appendChild: (parent: any, child: any) => void
  commitUpdate?: (instance: any, prevProps: any, nextProps: any) => void
}

export function reconcile(
  vnode: VNode,
  prevVNode: VNode | null,
  parent: any,
  hostConfig: HostConfigProps
) {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    const textInstance = hostConfig.createInstance('Text', { text: String(vnode) })
    hostConfig.appendChild(parent, textInstance)
    return
  }

  const instance = hostConfig.createInstance(vnode.type as string, vnode.props)

  const children = Array.isArray(vnode.props?.children)
    ? vnode.props.children
    : [vnode.props?.children]

  for (const child of children) {
    if (child == null) continue
    reconcile(child as VNode, null, instance, hostConfig)
  }

  hostConfig.appendChild(parent, instance)
}
