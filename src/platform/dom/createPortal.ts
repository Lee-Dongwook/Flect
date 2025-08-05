import type { VNode } from '../../domain/vdom/model/vnode'
import { render } from './render'

export function createPortal(vnode: VNode, container: HTMLElement): VNode {
  render(vnode, container)
  return {
    type: 'noscript',
    props: { children: [] },
  }
}
