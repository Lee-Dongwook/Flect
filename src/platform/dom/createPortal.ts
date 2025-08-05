import type { VNode } from '../../domain/vdom/model/vnode'

export function createPortal(vnode: VNode, container: HTMLElement): VNode {
  return {
    type: () => {
      if (container) {
        container.innerHTML = ''
        const renderedNode =
          typeof vnode === 'string' ? document.createTextNode(String(vnode)) : null
        if (renderedNode) container.appendChild(renderedNode)
      } else {
        console.warn('createPortal: container is null')
      }

      return vnode
    },
    props: {},
  }
}
