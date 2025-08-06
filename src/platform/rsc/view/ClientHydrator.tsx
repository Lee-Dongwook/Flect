import { useEffect } from '../../../domain/hooks/services/useEffect'
import { useState } from '../../../domain/hooks/services/useState'
import { VNode } from '../../../domain/vdom/model/vnode'

interface ClientPlaceholderProps {
  id: string
  props: Record<string, any>
  fallback?: VNode | string
}

export function ClientPlaceholder({
  id,
  props,
  fallback = 'Loading...',
}: ClientPlaceholderProps): VNode {
  const [mod, setMod] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    import(`/client/${id}.js`)
      .then((m) => {
        if (cancelled) return
        if (!m.default) {
          throw new Error(`Client component ${id} does not have a default export`)
        }
        setMod(() => m.default)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : String(err))
      })

    return () => {
      cancelled = true
    }
  }, [id])

  if (error) {
    return {
      type: 'div',
      props: {
        style: { color: 'red' },
        children: [`Failed to load client component: ${error}`],
      },
    }
  }

  if (!mod) {
    return typeof fallback === 'string'
      ? { type: 'span', props: { children: [fallback] } }
      : fallback
  }

  return {
    type: mod,
    props,
  }
}
