import {
  ConfigureStoreOptions,
  Store,
  Reducer,
  ReducersMapObject,
  GetDefaultMiddleware,
  GetDefaultMiddlewareOptions,
  StoreEnhancer,
  DeepPartial,
  Action,
  AnyAction,
  Middleware,
} from '../model/types'
import { ReduxStore, applyMiddleware } from '../model/store'
import { combineReducers } from './combineReducers'
import { getDefaultMiddleware } from '../middleware/defaultMiddleware'
import { devToolsEnhancer } from '../enhancers/devTools'

export function configureStore<
  S = any,
  A extends Action = AnyAction,
  M extends Middleware[] = Middleware[],
>(options: ConfigureStoreOptions<S, A, M>): Store<S, A> {
  const { reducer, preloadedState, middleware, devTools = true, enhancers = [] } = options

  // Combine reducers if it's a map
  const rootReducer: Reducer<S, A> =
    typeof reducer === 'function' ? reducer : combineReducers(reducer)

  // Get default middleware
  const getDefaultMiddlewareFn: GetDefaultMiddleware<S> = (options) => getDefaultMiddleware(options)

  // Apply middleware
  const middlewareEnhancer = applyMiddleware(
    ...(typeof middleware === 'function'
      ? middleware(getDefaultMiddlewareFn)
      : middleware || getDefaultMiddlewareFn())
  )

  // Apply enhancers
  const finalEnhancers =
    typeof enhancers === 'function'
      ? enhancers([middlewareEnhancer])
      : [middlewareEnhancer, ...enhancers]

  // Apply devTools if enabled
  if (devTools && typeof window !== 'undefined') {
    const devToolsOptions = typeof devTools === 'object' ? devTools : {}
    finalEnhancers.push(devToolsEnhancer(devToolsOptions))
  }

  // Compose enhancers
  const composedEnhancer = composeEnhancers(...finalEnhancers)

  // Create store
  const store = composedEnhancer(createStore)(rootReducer, preloadedState as S)

  return store
}

// Create store function
function createStore<S, A extends Action>(reducer: Reducer<S, A>, preloadedState?: S): Store<S, A> {
  return new ReduxStore(reducer, preloadedState)
}

// Compose enhancers
function composeEnhancers(...enhancers: StoreEnhancer[]): StoreEnhancer {
  if (enhancers.length === 0) {
    return (next) => next
  }

  if (enhancers.length === 1) {
    return enhancers[0]
  }

  return enhancers.reduce((a, b) => (next) => a(b(next)))
}
