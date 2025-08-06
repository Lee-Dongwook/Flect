import { Plugin } from 'vite'

export function flectRSCPlugin(): Plugin {
  return {
    name: 'flect:rsc',
    enforce: 'pre',

    async transform(code, id) {
      if (id.endsWith('.client.tsx') || id.endsWith('.client.jsx')) {
        if (code.startsWith('"use client"') || code.startsWith("'use client'")) {
          return {
            code,
            meta: {
              flectIsClientComponent: true,
            },
          }
        }
      }
      return null
    },
  }
}
