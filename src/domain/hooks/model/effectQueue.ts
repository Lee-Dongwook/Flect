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
  while (layoutEffectQueue.length) {
    const effect = layoutEffectQueue.shift()
    effect?.()
  }
}

export function flushEffects() {
  while (effectQueue.length) {
    const effect = effectQueue.shift()
    Promise.resolve().then(effect)
  }
}
