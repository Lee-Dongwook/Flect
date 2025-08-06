import { Middleware, AnyAction, SerializableCheckOptions } from '../model/types'

export function serializableCheckMiddleware(options: SerializableCheckOptions = {}): Middleware {
  const {
    ignoredActions = [],
    ignoredActionPaths = [],
    ignoredPaths = [],
    warnAfter = 128,
    ignoreState = false,
    ignoreActions = false,
  } = options

  return () => (next) => (action: AnyAction) => {
    if (ignoreActions) {
      return next(action)
    }

    // Check if action should be ignored
    if (ignoredActions.includes(action.type)) {
      return next(action)
    }

    // Check action serializability
    const nonSerializableValue = findNonSerializableValue(action, ignoredActionPaths, 'action')
    if (nonSerializableValue) {
      console.warn(
        `A non-serializable value was detected in an action, in the path: ${nonSerializableValue.path}. ` +
        `Take a look at the reducer(s) handling this action type: ${action.type}. ` +
        `(See https://redux.js.org/faq/actions#why-should-type-be-a-string-or-at-least-serializable-why-should-my-action-types-be-constants)`
      )
    }

    return next(action)
  }
}

function findNonSerializableValue(
  obj: any,
  ignoredPaths: string[] = [],
  path: string = ''
): { path: string; value: any } | null {
  if (obj === null || obj === undefined) {
    return null
  }

  if (typeof obj !== 'object') {
    return null
  }

  if (obj instanceof Date) {
    return null
  }

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const currentPath = path ? `${path}[${i}]` : `[${i}]`
      if (ignoredPaths.includes(currentPath)) {
        continue
      }

      const result = findNonSerializableValue(obj[i], ignoredPaths, currentPath)
      if (result) {
        return result
      }
    }
    return null
  }

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const currentPath = path ? `${path}.${key}` : key
      if (ignoredPaths.includes(currentPath)) {
        continue
      }

      const value = obj[key]
      if (typeof value === 'function') {
        return { path: currentPath, value }
      }

      const result = findNonSerializableValue(value, ignoredPaths, currentPath)
      if (result) {
        return result
      }
    }
  }

  return null
} 