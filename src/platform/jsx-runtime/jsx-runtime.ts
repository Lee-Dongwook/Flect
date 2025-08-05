import { h } from '../../domain/vdom/services/createVNode'
import type { VNode } from '../../domain/vdom/model/vnode'

function normalizeChildren(children: any): VNode['props']['children'] {
  if (Array.isArray(children)) return children.flat().filter((c) => c !== null && c !== undefined)
  if (children == null) return []
  return [children]
}

export function jsx(type: VNode['type'], props: VNode['props'] & { children?: any }): VNode {
  const { children, ...restProps } = props || {}
  const normalizedChildren = normalizeChildren(children)

  return h(type, {
    ...restProps,
    children: normalizedChildren,
  })
}

export const jsxs = jsx
export const jsxDev = jsx

export default { jsx, jsxs, jsxDev }
