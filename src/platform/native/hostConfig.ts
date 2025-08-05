import type { VNode } from '../../domain/vdom/model/vnode'

interface NativeInstance {
  type: string
  props: any
  children: NativeInstance[]
}

export function createNativeRoot(ctx: CanvasRenderingContext2D) {
  return {
    type: 'ROOT',
    props: {},
    children: [] as NativeInstance[],
    context: ctx,
  }
}

export function createNativeInstance(type: string, props: any): NativeInstance {
  return {
    type,
    props,
    children: [],
  }
}

export function appendChild(parent: NativeInstance, child: NativeInstance) {
  parent.children.push(child)
}

export function drawNode(node: NativeInstance, ctx: CanvasRenderingContext2D) {
  if (node.type === 'View') {
    const { x = 0, y = 0, width = 100, height = 100, color = '#ccc' } = node.props.style ?? {}
    ctx.fillStyle = color
    ctx.fillRect(x, y, width, height)
  } else if (node.type === 'Text') {
    const { x = 0, y = 0, text = '', font = '16px sans-serif', color = '#000' } = node.props
    ctx.fillStyle = color
    ctx.font = font
    ctx.fillText(text, x, y)
  }

  node.children.forEach((child) => drawNode(child, ctx))
}
