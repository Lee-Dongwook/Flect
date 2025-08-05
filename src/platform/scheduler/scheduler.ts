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
  let timer = timerQueue.peek()

  while (timer && timer.startTime <= currentTime) {
    timerQueue.pop()
    timer.sortIndex = timer.expirationTime
    taskQueue.push(timer)
    timer = timerQueue.peek()
  }
}

function workLoop(hasTimeRemaining: boolean, currentTime: number): boolean {
  currentTask = null
  advanceTimers(currentTime)

  let task = taskQueue.peek()

  while (task) {
    if (task.expirationTime > currentTime && shouldYieldToHost()) {
      break
    }

    const callback = task.callback
    if (typeof callback === 'function') {
      taskQueue.pop()
      currentTask = task

      const continuationCallback = callback()

      if (typeof continuationCallback === 'function') {
        task.callback = continuationCallback
        taskQueue.push(task)
      }
    } else {
      taskQueue.pop()
    }
    task = taskQueue.peek()
  }
  return taskQueue.size() > 0
}

function flushWork(hasTimeRemaining: boolean, initialTime: number) {
  isHostCallbackScheduled = false
  const currentTime = getCurrentTime()

  return workLoop(hasTimeRemaining, currentTime)
}

function getTimeoutByPriority(priority: SchdulerPriority): number {
  switch (priority) {
    case ImmediatePriority:
      return -1
    case UserBlockingPriority:
      return 250
    case NormalPriority:
      return 5000
    case LowPriority:
      return 10000
    case IdlePriority:
      return Infinity
    default:
      return 5000
  }
}

export function scheduleCallback(
  priorityLevel: SchdulerPriority,
  callback: () => void,
  options?: { delay?: number; timeout?: number }
): Task {
  const currentTime = getCurrentTime()
  const delay = options?.delay ?? 0
  const startTime = currentTime + delay
  const timeout = options?.timeout ?? getTimeoutByPriority(priorityLevel)
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
    timerQueue.push(newTask)
  } else {
    taskQueue.push(newTask)
  }

  if (!isHostCallbackScheduled) {
    isHostCallbackScheduled = true
    requestHostCallback(flushWork)
  }

  return newTask
}

export function cancelCallback(task: Task) {
  task.callback = null
}

export function unstable_getCurrentPriorityLevel(): SchdulerPriority {
  return currentTask?.priorityLevel ?? NormalPriority
}
