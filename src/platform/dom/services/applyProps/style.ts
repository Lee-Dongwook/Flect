function toKebabCase(name: string): string {
  return name.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())
}

function normalizeStyleValue(value: string | number): string {
  return typeof value === 'number' && value !== 0 ? `${value}px` : `${value}`
}

export function applyStyle(el: HTMLElement, style: Record<string, string | number>) {
  for (const key in style) {
    const value = style[key]
    if (value != null) {
      el.style.setProperty(toKebabCase(key), normalizeStyleValue(value))
    }
  }
}
