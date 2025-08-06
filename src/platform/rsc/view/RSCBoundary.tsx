import { useEffect } from '../../../domain/hooks/services/useEffect'
import { VNode } from '../../../domain/vdom/model/vnode'
import { useState } from '../../../domain/hooks/services/useState'
import { parseRSCStreamToVNode } from '../model/rscDeserializer'

interface RSCBoundaryProps {
  src: string
  fallback?: VNode | string
}

export function RSCBoundary({ src, fallback = 'Loading...' }: RSCBoundaryProps) {
  const [vnode, setVnode] = useState<VNode | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch(src)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.text()
      })
      .then((data) => {
        if (cancelled) return
        try {
          const parsed = parseRSCStreamToVNode(data)
          setVnode(parsed)
        } catch (parseError) {
          setError(parseError instanceof Error ? parseError.message : String(parseError))
        }
      })
      .catch((fetchError) => {
        if (cancelled) return
        setError(fetchError instanceof Error ? fetchError.message : String(fetchError))
      })

    return () => {
      cancelled = true
    }
  }, [src])

  if (error) return { type: 'div', props: { children: `Error: ${error}` } }
  if (!vnode) {
    return typeof fallback === 'string' ? { type: 'span', props: { children: fallback } } : fallback
  }

  // Wrap the loaded vnode inside a passthrough component
  return {
    type: () => vnode,
    props: {},
  }
}
