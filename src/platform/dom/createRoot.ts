import type { VNode } from '../../domain/vdom/model/vnode'
import { render } from '../../domain/renderer/services/render'

export function createRoot(container: HTMLElement) {
  return {
    render(vnode: VNode) {
      render(vnode, container)
    },
  }
}
