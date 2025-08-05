import type { VNode } from '../model/vnode'

export function h(
  type: VNode['type'],
  props: VNode['props'],
  ...children: VNode['children']
): VNode {
  const normalizedChildren = (children ?? []).flat()
  return { type, props: props || {}, children: normalizedChildren }
}
