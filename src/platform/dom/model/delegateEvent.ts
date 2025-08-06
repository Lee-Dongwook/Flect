import { createSyntheticEvent } from './syntheticEvent'

type EventName = keyof GlobalEventHandlersEventMap

const registeredEvents = new Set<string>()

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function getEventHandler(
  el: HTMLElement,
  eventType: string,
  capture: boolean
): ((e: Event) => void) | undefined {
  const suffix = capture ? 'Capture' : ''
  const propName = `__on${capitalize(eventType)}${suffix}`
  return (el as any)[propName]
}

function handleEvent(nativeEvent: Event) {
  const eventType = nativeEvent.type
  const syntheticEvent = createSyntheticEvent(nativeEvent)

  const captureHandlers: ((e: Event) => void)[] = []
  const bubbleHandlers: ((e: Event) => void)[] = []

  let target = nativeEvent.target as HTMLElement | null
  const path: HTMLElement[] = []

  while (target) {
    path.push(target)
    target = target.parentElement
  }

  // Capture phase
  for (let i = path.length - 1; i >= 0; i--) {
    const el = path[i]
    const handler = getEventHandler(el, eventType, true)
    if (handler) captureHandlers.push(handler)
  }

  // Bubble phase
  for (let i = 0; i < path.length; i++) {
    const el = path[i]
    const handler = getEventHandler(el, eventType, false)
    if (handler) bubbleHandlers.push(handler)
  }

  for (const fn of captureHandlers) {
    fn(syntheticEvent)
    if (syntheticEvent.isPropagationStopped()) return
  }

  for (const fn of bubbleHandlers) {
    fn(syntheticEvent)
    if (syntheticEvent.isPropagationStopped()) return
  }
}

export function initEventDelegation(root: HTMLElement) {
  const supportedEvents: EventName[] = [
    'click',
    'dblclick',
    'mousedown',
    'mouseup',
    'mousemove',
    'mouseenter',
    'mouseleave',
    'keydown',
    'keyup',
    'input',
    'change',
    'submit',
    'focus',
    'blur',
    'pointerdown',
    'pointerup',
    'pointermove',
    'touchstart',
    'touchend',
    'touchmove',
  ]

  const alwaysUseCapturePhase: Set<EventName> = new Set([
    'focus',
    'blur',
    'mouseenter',
    'mouseleave',
  ])

  for (const eventName of supportedEvents) {
    if (registeredEvents.has(eventName)) continue

    const useCapture = alwaysUseCapturePhase.has(eventName)
    root.addEventListener(eventName, handleEvent, {
      capture: useCapture,
      passive: false,
    })
    registeredEvents.add(eventName)
  }
}
