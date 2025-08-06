import { VNode } from '../../../domain/vdom/model/vnode'

// Helper function to check if an object is a valid VNode
function isValidElement(value: any): value is VNode {
  return value && typeof value === 'object' && 'type' in value && 'props' in value
}

function buildFlightPayload(vnode: VNode): any {
  const { type, props } = vnode

  const serializedProps = Object.entries(props ?? {}).reduce(
    (acc, [key, value]) => {
      if (typeof value === 'function') {
        acc[key] = null
      } else if (typeof value === 'object' && isValidElement(value)) {
        acc[key] = buildFlightPayload(value)
      } else {
        acc[key] = value
      }
      return acc
    },
    {} as Record<string, any>
  )
  return {
    $$typeof: 'react.flight.element', // Use string instead of Symbol for serialization
    type: typeof type === 'function' ? type.name : type,
    props: serializedProps,
  }
}

export function serializeVNodeToRSC(vnode: VNode): string {
  if (!isValidElement(vnode)) {
    throw new Error('Only elements can be rendered as server components.')
  }

  const flightPayload = buildFlightPayload(vnode)
  return JSON.stringify(flightPayload)
}
