export interface SyntheticEvent<T extends EventTarget = Element> extends Event {
  nativeEvent: Event
  currentTarget: T
  isPropagationStopped(): boolean
  isDefaultPrevented(): boolean
}

let pooledSyntheticEvents: SyntheticEvent | null = null

export function createSyntheticEvent(nativeEvent: Event): SyntheticEvent {
  const e = pooledSyntheticEvents ?? Object.assign({}, nativeEvent)
  pooledSyntheticEvents = null

  let propagationStopped = false
  let defaultPrevented = false

  const synthetic: Partial<SyntheticEvent> = {
    nativeEvent,
    get currentTarget() {
      return nativeEvent.currentTarget as Element
    },
    isPropagationStopped: () => propagationStopped,
    isDefaultPrevented: () => defaultPrevented,
    stopPropagation: () => {
      propagationStopped = true
      nativeEvent.stopPropagation?.()
    },
    preventDefault: () => {
      defaultPrevented = true
      nativeEvent.preventDefault?.()
    },
  }

  return Object.assign(e, synthetic) as SyntheticEvent
}

export function releaseSyntheticEvent() {
  pooledSyntheticEvents = null
}
