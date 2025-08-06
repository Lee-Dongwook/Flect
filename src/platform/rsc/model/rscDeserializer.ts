import { VNode } from '../../../domain/vdom/model/vnode'

const RSC_ELEMENT_TYPE = 'react.flight.element'

function createVNodeFromPayload(payload: any): VNode {
  const { type, props } = payload

  return {
    type,
    props: Object.entries(props ?? {}).reduce(
      (acc, [key, value]) => {
        if (
          value &&
          typeof value === 'object' &&
          '$$typeof' in value &&
          value.$$typeof === RSC_ELEMENT_TYPE
        ) {
          acc[key] = createVNodeFromPayload(value)
        } else {
          acc[key] = value
        }
        return acc
      },
      {} as Record<string, any>
    ),
  }
}

export function parseRSCStreamToVNode(stream: string): VNode {
  const data = JSON.parse(stream)

  if (data.$$typeof !== RSC_ELEMENT_TYPE) {
    throw new Error('Invalid RSC payload')
  }

  return createVNodeFromPayload(data)
}
