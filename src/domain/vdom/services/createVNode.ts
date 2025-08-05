import type { VNode } from '../model/vnode'

export function h(type: VNode['type'], props: VNode['props'] & { children?: any }): VNode {
  const { children, ...restProps } = props ?? {}
  const normalizedChildren = Array.isArray(children)
    ? children.flat().filter((c) => c !== null && c !== undefined)
    : [children]

  return {
    type,
    props: {
      ...restProps,
      children: normalizedChildren,
    },
  }
}
