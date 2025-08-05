import type { VNode } from '../model/vnode'

export function h(
  type: VNode['type'],
  props: VNode['props'],
  ...children: VNode['children']
): VNode {
  return { type, props: props || {}, children }
}
