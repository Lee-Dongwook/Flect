export function updateDomProperties(
  el: HTMLElement,
  prevProps: Record<string, any>,
  nextProps: Record<string, any>
) {
  for (const key in prevProps) {
    if (key === 'children') continue
    if (!(key in nextProps)) {
      el.removeAttribute(key)
    }
  }

  for (const key in nextProps) {
    if (key === 'children') {
      if (typeof nextProps.children === 'string' || typeof nextProps.children === 'number') {
        el.textContent = String(nextProps.children)
      }
    } else {
      el.setAttribute(key, nextProps[key])
    }
  }
}
