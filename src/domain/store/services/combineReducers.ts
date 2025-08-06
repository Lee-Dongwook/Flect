import { Reducer, ReducersMapObject, AnyAction } from '../model/types'

export function combineReducers<S = any, A extends AnyAction = AnyAction>(
  reducers: ReducersMapObject<S, A>
): Reducer<S, A> {
  const reducerKeys = Object.keys(reducers)
  const finalReducers: ReducersMapObject<S, A> = {}

  // Filter out non-function reducers
  for (const key of reducerKeys) {
    const reducer = reducers[key]
    if (typeof reducer === 'function') {
      finalReducers[key] = reducer
    }
  }

  const finalReducerKeys = Object.keys(finalReducers)

  return function combination(state: S = {} as S, action: A): S {
    let hasChanged = false
    const nextState: S = {} as S

    for (const key of finalReducerKeys) {
      const reducer = finalReducers[key]
      const previousStateForKey = state[key as keyof S]
      const nextStateForKey = reducer(previousStateForKey, action)

      if (typeof nextStateForKey === 'undefined') {
        const errorMessage = getUndefinedStateErrorMessage(key, action)
        throw new Error(errorMessage)
      }

      nextState[key as keyof S] = nextStateForKey
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }

    return hasChanged ? nextState : state
  }
}

function getUndefinedStateErrorMessage(key: string, action: AnyAction): string {
  const actionType = action && action.type
  const actionDescription = (actionType && `action "${String(actionType)}"`) || 'an action'

  return (
    `Given ${actionDescription}, reducer "${key}" returned undefined. ` +
    `To ignore an action, you must explicitly return the previous state. ` +
    `If you want this reducer to hold no value, you can return null instead of undefined.`
  )
}
