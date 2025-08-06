import { capitalize } from './delegateEvent'

export function applyPropsToElement(el: HTMLElement, props: Record<string, any>) {
  for (const key in props) {
    const value = props[key]

    if (key.startsWith('on') && typeof value === 'function') {
      const isCapture = key.endsWith('Capture')
      const eventName = key.slice(2, isCapture ? -7 : undefined).toLowerCase()
      const handlerName = `__on${capitalize(eventName)}${isCapture ? 'Capture' : ''}`

      delete (el as any)[`__on${capitalize(eventName)}`]
      delete (el as any)[`__on${capitalize(eventName)}Capture`]
      ;(el as any)[handlerName] = value
    } else if (key === 'style') {
      Object.assign(el.style, value)
    } else {
      el.setAttribute(key, value)
    }
  }
}
