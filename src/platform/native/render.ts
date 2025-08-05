import { reconcile } from '../../platform/reconciler/reconcile'
import type { VNode } from '../../domain/vdom/model/vnode'
import { createNativeRoot, createNativeInstance, appendChild, drawNode } from './hostConfig'

let rootCanvas: HTMLCanvasElement | null = null
let rootContext: CanvasRenderingContext2D | null = null

export function render(vnode: VNode, canvas: HTMLCanvasElement) {
  if (!canvas) throw new Error('Canvas element is required for native render.')

  if (!rootCanvas) {
    rootCanvas = canvas
    rootContext = canvas.getContext('2d')
    if (!rootContext) throw new Error('2D context not supported')
  }

  const root = createNativeRoot(rootContext!)

  reconcile(vnode, null, root, {
    createInstance: createNativeInstance,
    appendChild,
  })

  rootContext?.clearRect(0, 0, canvas.width, canvas.height)

  for (const child of root.children) {
    drawNode(child, rootContext!)
  }
}
