import { Action, ActionCreator } from '../model/types'

// Function overloads
export function createAction<P = void>(type: string): ActionCreator<P>
export function createAction<P = void, M = void, E = void>(
  type: string,
  prepareAction: (payload: P) => { payload: P; meta?: M; error?: E }
): ActionCreator<P>

// Implementation
export function createAction<P = void, M = void, E = void>(
  type: string,
  prepareAction?: (payload: P) => { payload: P; meta?: M; error?: E }
): ActionCreator<P> {
  const actionCreator = (payload?: P) => {
    if (prepareAction) {
      const prepared = prepareAction(payload as P)
      return {
        type,
        ...prepared,
      }
    }

    const action: Action<string> & { payload?: P } = { type }
    if (payload !== undefined) {
      action.payload = payload
    }
    return action
  }

  actionCreator.type = type
  actionCreator.toString = () => type
  actionCreator.match = (action: Action) => action.type === type

  return actionCreator as ActionCreator<P>
}
