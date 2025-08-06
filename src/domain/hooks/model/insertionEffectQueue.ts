const insertionEffectQueue: (() => void)[] = []

export function queueInsertionEffect(fn: () => void) {
  insertionEffectQueue.push(fn)
}

export function flushInsertionEffects() {
  while (insertionEffectQueue.length) {
    const effect = insertionEffectQueue.shift()
    effect?.()
  }
}
