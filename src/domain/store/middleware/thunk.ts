import { Middleware, Dispatch, AnyAction, ThunkAction } from '../model/types'

export const thunkMiddleware: Middleware<{}, any, Dispatch> = ({ dispatch, getState }) => {
  return (next: Dispatch) => (action: AnyAction) => {
    if (typeof action === 'function') {
      return action(dispatch, getState)
    }

    return next(action)
  }
}

// Thunk action creator type
export type ThunkDispatch<S, E, A extends AnyAction> = {
  <T extends A>(action: T): T
  <R>(asyncAction: ThunkAction<R, S, E, A>): R
}
