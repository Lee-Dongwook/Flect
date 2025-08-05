type Callback = (hasTimeRemaining: boolean, currentTime: number) => boolean | void

let scheduledHostCallback: Callback | null = null
let isMessageLoopRunning: boolean = false

const channel = new MessageChannel()
const port = channel.port2
const frameInterval = 5

let deadline = 0

function getCurrentTime(): number {
  return performance.now()
}

function shouldYieldToHost(): boolean {
  return getCurrentTime() >= deadline
}

function performWorkUntilDeadline() {
  if (scheduledHostCallback) {
    const currentTime = getCurrentTime()
    deadline = currentTime + frameInterval

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

export { getCurrentTime, shouldYieldToHost }
