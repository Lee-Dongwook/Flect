import {
  SliceOptions,
  Slice,
  SliceCaseReducers,
  SliceActions,
  AnyAction,
  ActionCreator,
  Action,
} from '../model/types'
import { createAction } from './createAction'

export function createSlice<
  State = any,
  CaseReducers extends SliceCaseReducers<State> = SliceCaseReducers<State>,
>(options: SliceOptions<State, CaseReducers>): Slice<State, CaseReducers> {
  const { name, initialState, reducers, extraReducers } = options

  // Create action creators for each reducer
  const actionCreators: SliceActions<CaseReducers> = {} as SliceActions<CaseReducers>
  const caseReducers: SliceCaseReducers<State> = {}

  // Process reducers
  Object.keys(reducers).forEach((reducerKey) => {
    const reducer = reducers[reducerKey]
    const actionType = `${name}/${reducerKey}`

    // Create action creator
    actionCreators[reducerKey as keyof CaseReducers] = createAction(actionType) as any

    // Create case reducer
    caseReducers[actionType] = reducer
  })

  // Create the main reducer
  const reducer: (state: State | undefined, action: AnyAction) => State = (
    state = initialState,
    action
  ) => {
    const caseReducer = caseReducers[action.type]
    if (caseReducer) {
      return caseReducer(state, action) as State
    }

    // Handle extra reducers
    if (extraReducers) {
      const extraCaseReducer = extraReducers[action.type]
      if (extraCaseReducer) {
        return extraCaseReducer(state, action) as State
      }
    }

    return state
  }

  // Create slice
  const slice: Slice<State, CaseReducers> = {
    name,
    reducer,
    actions: actionCreators,
    caseReducers,
    getInitialState: () => initialState,
  }

  return slice
}

// Builder pattern for extra reducers
export interface SliceBuilder<State> {
  addCase: <A extends Action>(
    actionCreator: ActionCreator<any> | string,
    reducer: (state: State, action: A) => State | void
  ) => SliceBuilder<State>
  addMatcher: <A extends Action>(
    matcher: (action: A) => boolean,
    reducer: (state: State, action: A) => State | void
  ) => SliceBuilder<State>
  addDefaultCase: (
    reducer: (state: State, action: AnyAction) => State | void
  ) => SliceBuilder<State>
}

export function createSliceBuilder<State>(initialState: State): SliceBuilder<State> {
  const extraReducers: Record<string, (state: State, action: AnyAction) => State | void> = {}
  const matchers: Array<{
    matcher: (action: AnyAction) => boolean
    reducer: (state: State, action: AnyAction) => State | void
  }> = []
  let defaultCase: ((state: State, action: AnyAction) => State | void) | null = null

  const builder: SliceBuilder<State> = {
    addCase(actionCreator, reducer) {
      const actionType = typeof actionCreator === 'string' ? actionCreator : actionCreator.type
      extraReducers[actionType] = reducer
      return builder
    },

    addMatcher(matcher, reducer) {
      matchers.push({ matcher, reducer })
      return builder
    },

    addDefaultCase(reducer) {
      defaultCase = reducer
      return builder
    },
  }

  return builder
}
