type EffectCallback = () => void

const layoutEffectQueue: EffectCallback[] = []
const effectQueue: EffectCallback[] = []

export function queueLayoutEffect(fn: EffectCallback) {
  layoutEffectQueue.push(fn)
}

export function queueEffect(fn: EffectCallback) {
  effectQueue.push(fn)
}

export function flushLayoutEffects() {
  for (const fn of layoutEffectQueue) fn()
  layoutEffectQueue.length = 0
}

export function flushEffects() {
  const queue = [...effectQueue]
  effectQueue.length = 0
  Promise.resolve().then(() => {
    for (const fn of queue) fn()
  })
}
