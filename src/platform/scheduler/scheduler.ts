import { requestHostCallback, shouldYieldToHost, getCurrentTime } from './host'
import { MinHeap } from '../../shared/utils'
import {
  ImmediatePriority,
  UserBlockingPriority,
  NormalPriority,
  LowPriority,
  IdlePriority,
  type PriorityLevel as SchdulerPriority,
} from './priorities'

interface Task {
  id: number
  callback: Function | null
  priorityLevel: SchdulerPriority
  startTime: number
  expirationTime: number
  sortIndex: number
}

let taskIdCounter = 1
let isHostCallbackScheduled = false
let currentTask: Task | null = null

const taskQueue = new MinHeap<Task>((a, b) => a.sortIndex - b.sortIndex)
const timerQueue = new MinHeap<Task>((a, b) => a.startTime - b.startTime)

function push(queue: Task[], task: Task) {
  queue.push(task)
  queue.sort((a, b) => a.sortIndex - b.sortIndex)
}

function advanceTimers(currentTime: number) {
  while (timerQueue.length > 0) {
    const timer = timerQueue[0]
    if (timer.startTime <= currentTime) {
      timerQueue.shift()
      timer.sortIndex = timer.expirationTime
      push(taskQueue, timer)
    } else {
      break
    }
  }
}

function workLoop(hasTimeRemaining: boolean, currentTime: number): boolean {
  currentTask = null
  advanceTimers(currentTime)

  while (taskQueue.length > 0) {
    const task = taskQueue[0]

    if (task.expirationTime > currentTime && shouldYieldToHost()) {
      break
    }

    const callback = task.callback
    if (typeof callback === 'function') {
      taskQueue.shift()
      currentTask = task
      const continuationCallback = callback()

      if (typeof continuationCallback === 'function') {
        task.callback = continuationCallback
        push(taskQueue, task)
      }
    }
  }
  return taskQueue.length > 0
}

function flushWork(hasTimeRemaining: boolean, initialTime: number) {
  isHostCallbackScheduled = false
  const currentTime = getCurrentTime()
  return workLoop(hasTimeRemaining, currentTime)
}

export function scheduleCallback(
  priorityLevel: SchdulerPriority,
  callback: () => void,
  options?: { delay?: number }
): Task {
  const currentTime = getCurrentTime()
  const delay = options?.delay ?? 0
  const startTime = currentTime + delay
  let timeout: number

  switch (priorityLevel) {
    case ImmediatePriority:
      timeout = -1
      break
    case UserBlockingPriority:
      timeout = 250
      break
    case NormalPriority:
      timeout = 5000
      break
    case LowPriority:
      timeout = 10000
      break
    case IdlePriority:
      timeout = Infinity
      break
    default:
      timeout = 5000
  }

  const expirationTime = startTime + timeout

  const newTask: Task = {
    id: taskIdCounter++,
    callback,
    priorityLevel,
    startTime,
    expirationTime,
    sortIndex: delay > 0 ? startTime : expirationTime,
  }

  if (delay > 0) {
    push(timerQueue, newTask)
  } else {
    push(taskQueue, newTask)
  }

  if (!isHostCallbackScheduled) {
    isHostCallbackScheduled = true
    requestHostCallback(flushWork)
  }

  return newTask
}

export function cancelCallback(task: Task) {
  const tqIndex = taskQueue.indexOf(task)
  if (tqIndex > -1) {
    taskQueue.splice(tqIndex, 1)
  }

  const tmIndex = timerQueue.indexOf(task)
  if (tmIndex > -1) {
    timerQueue.splice(tmIndex, 1)
  }

  task.callback = null
}

export function unstable_getCurrentPriorityLevel(): SchdulerPriority {
  return currentTask?.priorityLevel ?? NormalPriority
}
