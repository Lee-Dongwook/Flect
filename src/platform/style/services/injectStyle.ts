import { getStyleContext } from '../model/styleContext'

const STYLE_ELEMENT_ID = '__FLECT__STYLE__'

function getOrCreateStyleElement(): HTMLStyleElement {
  let styleEl = document.getElementById(STYLE_ELEMENT_ID) as HTMLStyleElement | null

  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = STYLE_ELEMENT_ID
    styleEl.setAttribute('data-react-clone', 'style')
    document.head.appendChild(styleEl)
  }
  return styleEl
}

export function injectStyle(className: string, cssText: string) {
  const ctx = getStyleContext()
  if (ctx.inserted.has(className)) return

  const styleEl = getOrCreateStyleElement()
  styleEl.appendChild(document.createTextNode(cssText))
  ctx.inserted.add(className)
}
