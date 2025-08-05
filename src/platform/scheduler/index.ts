import { scheduleCallback as internalScheduleCallback } from './scheduler'
import {
  ImmediatePriority,
  UserBlockingPriority,
  NormalPriority,
  LowPriority,
  IdlePriority,
  type PriorityLevel as SchedulerPriority,
} from './priorities'

export {
  ImmediatePriority,
  UserBlockingPriority,
  NormalPriority,
  LowPriority,
  IdlePriority,
  type SchedulerPriority,
}

export function scheduleCallback(priority: SchedulerPriority, callback: () => void) {
  return internalScheduleCallback(priority, callback)
}
