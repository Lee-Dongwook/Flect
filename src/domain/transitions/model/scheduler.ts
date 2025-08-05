export function scheduleCallback(cb: () => void) {
  queueMicrotask(cb)
}
