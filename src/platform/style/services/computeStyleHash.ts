export function computeStyleHash(obj: Record<string, any>): string {
  const json = JSON.stringify(obj)
  let hash = 0

  for (let i = 0; i < json.length; i++) {
    const char = json.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0 // Convert to 32bit int
  }

  return 'css-' + Math.abs(hash).toString(36)
}
