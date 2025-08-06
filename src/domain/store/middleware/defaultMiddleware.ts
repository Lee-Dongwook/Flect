import { GetDefaultMiddleware, GetDefaultMiddlewareOptions, Middleware } from '../model/types'
import { thunkMiddleware } from './thunk'
import { serializableCheckMiddleware } from './serializableCheck'
import { immutableCheckMiddleware } from './immutableCheck'

export function getDefaultMiddleware<S = any>(
  options: GetDefaultMiddlewareOptions = {}
): Middleware[] {
  const { thunk = true, serializableCheck = true, immutableCheck = true } = options

  const middleware: Middleware[] = []

  if (thunk) {
    middleware.push(thunkMiddleware)
  }

  if (serializableCheck) {
    middleware.push(
      serializableCheckMiddleware(serializableCheck === true ? {} : serializableCheck)
    )
  }

  if (immutableCheck) {
    middleware.push(immutableCheckMiddleware(immutableCheck === true ? {} : immutableCheck))
  }

  return middleware
}
