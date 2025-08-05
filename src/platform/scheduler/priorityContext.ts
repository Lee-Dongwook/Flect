import { NormalPriority, type PriorityLevel } from './priorities'

let currentPriorityLevel: PriorityLevel = NormalPriority

export function runWithPriority<T>(priorityLevel: PriorityLevel, fn: () => T): T {
  const prev = currentPriorityLevel
  currentPriorityLevel = priorityLevel

  try {
    return fn()
  } finally {
    currentPriorityLevel = prev
  }
}

export function wrapCallbackWithPriority<T extends (...args: any[]) => any>(
  priorityLevel: PriorityLevel,
  callback: T
): T {
  return function (...args: Parameters<T>): ReturnType<T> {
    return runWithPriority(priorityLevel, () => callback(...args))
  } as T
}

export function getCurrentPriorityLevel(): PriorityLevel {
  return currentPriorityLevel
}
