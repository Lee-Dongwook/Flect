import { computeStyleHash } from './computeStyleHash'
import { injectStyle } from './injectStyle'

function objectToCSS(selector: string, styles: Record<string, any>): string {
  const cssProps = Object.entries(styles)
    .map(([key, value]) => {
      const kebab = key.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())
      return `${kebab}: ${value};`
    })
    .join(' ')
  return `.${selector} { ${cssProps} }`
}

export function registerStyle(styleObj: Record<string, any>): string {
  const className = computeStyleHash(styleObj)
  const cssText = objectToCSS(className, styleObj)
  injectStyle(className, cssText)
  return className
}
