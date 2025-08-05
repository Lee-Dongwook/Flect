type EffectCallback = () => void

const insertionEffectQueue: EffectCallback[] = []

export function queueInsertionEffect(fn: EffectCallback) {
  insertionEffectQueue.push(fn)
}

export function flushInsertionEffects() {
  for (const fn of insertionEffectQueue) fn()
  insertionEffectQueue.length = 0
}
