import {
  ThunkAction,
  AsyncThunkOptions,
  AsyncThunkActionCreator,
  PendingAction,
  FulfilledAction,
  RejectedAction,
  AnyAction,
} from '../model/types'

export function createAsyncThunk<
  Returned,
  ThunkArg = void,
  ThunkApiConfig extends {
    state?: any
    dispatch?: any
    extra?: any
    rejectValue?: any
    serializedErrorType?: any
  } = {},
>(
  typePrefix: string,
  payloadCreator: (
    arg: ThunkArg,
    api: {
      dispatch: ThunkApiConfig['dispatch'] extends any ? ThunkApiConfig['dispatch'] : any
      getState: () => ThunkApiConfig['state'] extends any ? ThunkApiConfig['state'] : any
      extra: ThunkApiConfig['extra'] extends any ? ThunkApiConfig['extra'] : any
      requestId: string
      signal: AbortSignal
      rejectWithValue: (
        value: ThunkApiConfig['rejectValue'] extends any ? ThunkApiConfig['rejectValue'] : any
      ) => any
      fulfillWithValue: (value: any) => any
    }
  ) => Promise<Returned> | Returned,
  options?: AsyncThunkOptions<ThunkArg>
): AsyncThunkActionCreator<Returned, ThunkArg, ThunkApiConfig> {
  const pending = createAction(`${typePrefix}/pending`)
  const fulfilled = createAction<FulfilledAction<Returned, ThunkArg>>(`${typePrefix}/fulfilled`)
  const rejected = createAction<RejectedAction<ThunkArg>>(`${typePrefix}/rejected`)

  const thunkActionCreator = (
    arg: ThunkArg
  ): ThunkAction<Promise<Returned>, any, any, AnyAction> => {
    return async (dispatch, getState, extra) => {
      const requestId = options?.idGenerator?.() || Math.random().toString(36).substr(2, 9)

      // Check condition
      if (options?.condition) {
        const shouldProceed = options.condition(arg, { getState })
        if (shouldProceed === false) {
          return Promise.reject(new Error('Aborted due to condition'))
        }
      }

      // Dispatch pending action
      dispatch(pending({ requestId, arg }))

      try {
        const result = await payloadCreator(arg, {
          dispatch,
          getState,
          extra,
          requestId,
          signal: new AbortController().signal,
          rejectWithValue: (value: any) => ({ rejectedWithValue: true, value }),
          fulfillWithValue: (value: any) => ({ fulfilledWithValue: true, value }),
        })

        // Dispatch fulfilled action
        dispatch(
          fulfilled({
            payload: result,
            meta: { requestId, arg },
          })
        )

        return result
      } catch (error) {
        const serializedError = options?.serializeError?.(error) || error

        // Dispatch rejected action
        dispatch(
          rejected({
            error: serializedError,
            meta: {
              requestId,
              arg,
              aborted: false,
              condition: false,
            },
          })
        )

        throw error
      }
    }
  }

  // Add action creators to the thunk
  thunkActionCreator.pending = pending
  thunkActionCreator.fulfilled = fulfilled
  thunkActionCreator.rejected = rejected
  thunkActionCreator.settled = (action: any) =>
    action.type === fulfilled.type || action.type === rejected.type

  return thunkActionCreator as AsyncThunkActionCreator<Returned, ThunkArg, ThunkApiConfig>
}

// Import createAction
import { createAction } from './createAction'
