import { VNode } from '../../../domain/vdom/model/vnode'
import { serializeVNodeToRSC } from './rscSerializer'

export function renderToReadableStream(vnode: VNode): ReadableStream<string> {
  const json = serializeVNodeToRSC(vnode)

  let sent = false

  return new ReadableStream({
    start(controller) {
      if (sent) {
        controller.close()
        return
      }

      controller.enqueue(json)
      sent = true
      controller.close()
    },
  })
}
