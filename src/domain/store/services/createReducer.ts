import { Reducer, AnyAction } from '../model/types'

export interface ActionMatcher<A extends AnyAction> {
  (action: A): boolean
}

export interface ActionMatcherDescription<S, A extends AnyAction> {
  matcher: ActionMatcher<A>
  reducer: (state: S, action: A) => S | void
}

export interface CaseReducer<S, A extends AnyAction> {
  (state: S, action: A): S | void
}

export interface CaseReducers<S, A extends AnyAction> {
  [K: string]: CaseReducer<S, A>
}

export interface CreateReducerBuilder<S, A extends AnyAction> {
  addCase: <T extends A>(
    actionCreator: { type: string } | string,
    reducer: CaseReducer<S, T>
  ) => CreateReducerBuilder<S, A>
  addMatcher: <T extends A>(
    matcher: ActionMatcher<T>,
    reducer: CaseReducer<S, T>
  ) => CreateReducerBuilder<S, A>
  addDefaultCase: (reducer: CaseReducer<S, A>) => Reducer<S, A>
}

export function createReducer<S, A extends AnyAction = AnyAction>(
  initialState: S,
  caseReducers?: CaseReducers<S, A>
): Reducer<S, A> {
  return createReducerBuilder(initialState, caseReducers)
}

function createReducerBuilder<S, A extends AnyAction>(
  initialState: S,
  caseReducers?: CaseReducers<S, A>
): CreateReducerBuilder<S, A> {
  const cases: Record<string, CaseReducer<S, A>> = {}
  const matchers: ActionMatcherDescription<S, A>[] = []
  let defaultCase: CaseReducer<S, A> | null = null

  // Add initial case reducers
  if (caseReducers) {
    Object.keys(caseReducers).forEach((key) => {
      const actionType = caseReducers[key].type || key
      cases[actionType] = caseReducers[key]
    })
  }

  const builder: CreateReducerBuilder<S, A> = {
    addCase(actionCreator, reducer) {
      const actionType = typeof actionCreator === 'string' ? actionCreator : actionCreator.type
      cases[actionType] = reducer
      return builder
    },

    addMatcher(matcher, reducer) {
      matchers.push({ matcher, reducer })
      return builder
    },

    addDefaultCase(reducer) {
      defaultCase = reducer
      return createFinalReducer()
    },
  }

  function createFinalReducer(): Reducer<S, A> {
    return (state = initialState, action: A): S => {
      // Check exact matches first
      const caseReducer = cases[action.type]
      if (caseReducer) {
        const result = caseReducer(state, action)
        if (result !== undefined) {
          return result
        }
      }

      // Check matchers
      for (const { matcher, reducer } of matchers) {
        if (matcher(action)) {
          const result = reducer(state, action)
          if (result !== undefined) {
            return result
          }
        }
      }

      // Default case
      if (defaultCase) {
        const result = defaultCase(state, action)
        if (result !== undefined) {
          return result
        }
      }

      return state
    }
  }

  return builder
}
