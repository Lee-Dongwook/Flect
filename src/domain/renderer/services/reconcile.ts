import type { VNode } from 'domain/vdom/model/vnode'
import { shallowEqual } from '../lib/shallowEqual'

function isTextNode(node: VNode | string): node is string {
  return typeof node === 'string'
}

function isVNode(node: VNode | string): node is VNode {
  return typeof node === 'object' && node !== null && 'type' in node
}

export function reconcile(prev: VNode | string, next: VNode | string): boolean {
  if (typeof prev !== typeof next) return false

  if (isTextNode(prev) && isTextNode(next)) {
    return prev === next
  }

  if (isVNode(prev) && isVNode(next)) {
    if (prev.type !== next.type) return false
    if (!shallowEqual(prev.props ?? {}, next.props ?? {})) return false
    return true
  }

  return false
}
