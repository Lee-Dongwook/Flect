import { scheduleCallback } from './scheduler'
import { ImmediatePriority } from './priorities'

type SyncCallback = () => void

let syncQueue: SyncCallback[] = []

export function scheduleSyncCallback(callback: SyncCallback) {
  syncQueue.push(callback)
}

export function flushSyncCallbackQueue() {
  if (syncQueue.length === 0) return

  const queue = [...syncQueue]
  syncQueue = []

  for (const cb of queue) {
    scheduleCallback(ImmediatePriority, cb)
  }
}
