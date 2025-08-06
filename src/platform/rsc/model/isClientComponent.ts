export function isClientComponentSource(code: string): boolean {
  return code.startsWith('"use client"') || code.startsWith("'use client'")
}
