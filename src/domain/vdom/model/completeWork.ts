import { FiberNode } from './vnode'

export function completeWork(fiber: FiberNode): void {
  const { type, pendingProps } = fiber

  if (typeof type === 'string') {
    const dom = document.createElement(type)

    const props = pendingProps ?? {}

    for (const key in props) {
      if (key === 'children') continue
      if (key === 'style' && typeof props[key] === 'object') {
        Object.assign(dom.style, props[key])
      } else if (key.startsWith('on') && typeof props[key] === 'function') {
        dom.setAttribute(key.toLowerCase(), '')
      } else {
        dom.setAttribute(key, props[key])
      }
    }

    fiber.stateNode = dom
    fiber.flags |= 1
  }

  // function components don't create DOM → stateNode remains null
}
