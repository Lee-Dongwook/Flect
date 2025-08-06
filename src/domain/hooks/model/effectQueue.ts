type EffectCallback = () => void

const layoutEffectQueue: EffectCallback[] = []
const passiveEffectQueue: EffectCallback[] = []

export function queueLayoutEffect(callback: EffectCallback) {
  layoutEffectQueue.push(callback)
}

export function queueEffect(callback: EffectCallback) {
  passiveEffectQueue.push(callback)
}

export function flushLayoutEffects() {
  while (layoutEffectQueue.length) {
    const effect = layoutEffectQueue.shift()
    try {
      effect?.()
    } catch (e) {
      console.error('layoutEffect error:', e)
    }
  }
}

export function flushEffects() {
  while (passiveEffectQueue.length) {
    const effect = passiveEffectQueue.shift()
    Promise.resolve().then(() => {
      try {
        effect?.()
      } catch (e) {
        console.error('effect error:', e)
      }
    })
  }
}
