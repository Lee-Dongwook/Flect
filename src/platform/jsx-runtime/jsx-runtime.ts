import { h } from '../../domain/vdom/services/createVNode'
import type { VNode } from '../../domain/vdom/model/vnode'

export function jsx(
  type: VNode['type'],
  props: VNode['props'],
  ...children: VNode['children']
): VNode {
  // undefined나 null인 children 제거
  const filteredChildren = children.filter((child) => child !== undefined && child !== null)
  return h(type, props, ...filteredChildren)
}

export function jsxs(
  type: VNode['type'],
  props: VNode['props'],
  ...children: VNode['children']
): VNode {
  // undefined나 null인 children 제거
  const filteredChildren = children.filter((child) => child !== undefined && child !== null)
  return h(type, props, ...filteredChildren)
}

export function jsxDev(
  type: VNode['type'],
  props: VNode['props'],
  ...children: VNode['children']
): VNode {
  // undefined나 null인 children 제거
  const filteredChildren = children.filter((child) => child !== undefined && child !== null)
  return h(type, props, ...filteredChildren)
}

// React 호환성을 위한 default export
const React = { jsx, jsxs, jsxDev }
export default React
