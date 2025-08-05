type Callback = (hasTimeRemaining: boolean, currentTime: number) => boolean | void

let scheduledHostCallback: Callback | null = null
let isMessageLoopRunning: boolean = false

let yieldInterval = 5
let deadline = 0

const channel = new MessageChannel()
const port = channel.port2

let needsPaint: boolean = false

export function shouldYieldToHost(): boolean {
  return getCurrentTime() >= deadline || needsPaint
}

export function requestPaint() {
  needsPaint = true
}

export function forceFrameRate(fps: number) {
  if (fps < 1 || fps > 120) {
    console.warn('forceFrameRate: fps out of range')
    return
  }

  yieldInterval = Math.floor(1000 / fps)
}

export function getCurrentTime(): number {
  return performance.now()
}

function performWorkUntilDeadline() {
  if (scheduledHostCallback) {
    const currentTime = getCurrentTime()
    deadline = currentTime + yieldInterval
    needsPaint = false

    const hasMoreWork = scheduledHostCallback(true, currentTime)
    if (hasMoreWork) {
      port.postMessage(null)
    } else {
      isMessageLoopRunning = false
      scheduledHostCallback = null
    }
  } else {
    isMessageLoopRunning = false
  }
}

channel.port1.onmessage = performWorkUntilDeadline

export function requestHostCallback(cb: Callback) {
  scheduledHostCallback = cb

  if (!isMessageLoopRunning) {
    isMessageLoopRunning = true
    port.postMessage(null)
  }
}

export function cancelHostCallback() {
  scheduledHostCallback = null
  isMessageLoopRunning = false
}
