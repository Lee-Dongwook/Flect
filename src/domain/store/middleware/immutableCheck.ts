import { Middleware, AnyAction, ImmutableCheckOptions } from '../model/types'

export function immutableCheckMiddleware(options: ImmutableCheckOptions = {}): Middleware {
  const {
    ignoredPaths = [],
    warnAfter = 32,
  } = options

  return ({ getState }) => (next) => (action: AnyAction) => {
    const result = next(action)
    const state = getState()

    // Check for mutations in state
    const mutations = findMutations(state, ignoredPaths)
    if (mutations.length > 0) {
      console.warn(
        `A state mutation was detected inside a reducer, in the path: ${mutations[0].path}. ` +
        `Take a look at the reducer(s) handling this action type: ${action.type}. ` +
        `(See https://redux.js.org/style-guide/style-guide#do-not-mutate-state)`
      )
    }

    return result
  }
}

function findMutations(
  obj: any,
  ignoredPaths: string[] = [],
  path: string = ''
): Array<{ path: string; value: any }> {
  const mutations: Array<{ path: string; value: any }> = []

  if (obj === null || obj === undefined) {
    return mutations
  }

  if (typeof obj !== 'object') {
    return mutations
  }

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const currentPath = path ? `${path}[${i}]` : `[${i}]`
      if (ignoredPaths.includes(currentPath)) {
        continue
      }

      const value = obj[i]
      if (typeof value === 'object' && value !== null) {
        mutations.push(...findMutations(value, ignoredPaths, currentPath))
      }
    }
  } else {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const currentPath = path ? `${path}.${key}` : key
        if (ignoredPaths.includes(currentPath)) {
          continue
        }

        const value = obj[key]
        if (typeof value === 'object' && value !== null) {
          mutations.push(...findMutations(value, ignoredPaths, currentPath))
        }
      }
    }
  }

  return mutations
} 