import { Action, AnyAction, Reducer, Store, Dispatch, Middleware, StoreEnhancer } from './types'

export interface StoreState {
  [key: string]: any
}

export interface StoreSubscriber {
  (): void
}

export class ReduxStore<S = any, A extends Action = AnyAction> implements Store<S, A> {
  private state: S
  private reducer: Reducer<S, A>
  private listeners: StoreSubscriber[] = []
  private isDispatching = false
  private currentReducer: Reducer<S, A>

  constructor(reducer: Reducer<S, A>, preloadedState?: S) {
    this.currentReducer = reducer
    this.state = preloadedState || (reducer(undefined, { type: '@@INIT' } as A) as S)
  }

  getState(): S {
    if (this.isDispatching) {
      throw new Error('You may not call store.getState() while the reducer is executing.')
    }
    return this.state
  }

  dispatch(action: A): A {
    if (!isPlainObject(action)) {
      throw new Error('Actions must be plain objects.')
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property.')
    }

    if (this.isDispatching) {
      throw new Error('Reducers may not dispatch actions.')
    }

    try {
      this.isDispatching = true
      this.state = this.currentReducer(this.state, action)
    } finally {
      this.isDispatching = false
    }

    this.listeners.forEach((listener) => listener())
    return action
  }

  subscribe(listener: StoreSubscriber): () => void {
    if (typeof listener !== 'function') {
      throw new Error('Expected the listener to be a function.')
    }

    if (this.isDispatching) {
      throw new Error('You may not call store.subscribe() while the reducer is executing.')
    }

    let isSubscribed = true

    this.listeners.push(listener)

    return () => {
      if (!isSubscribed) {
        return
      }

      if (this.isDispatching) {
        throw new Error(
          'You may not unsubscribe from a store listener while the reducer is executing.'
        )
      }

      isSubscribed = false
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  replaceReducer(nextReducer: Reducer<S, A>): void {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.')
    }

    this.currentReducer = nextReducer
    this.dispatch({ type: '@@REPLACE' } as A)
  }
}

// Utility function to check if object is plain
function isPlainObject(obj: any): obj is object {
  if (typeof obj !== 'object' || obj === null) return false

  let proto = obj
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto)
  }

  return Object.getPrototypeOf(obj) === proto
}

// Store enhancer to apply middleware
export function applyMiddleware(...middlewares: Middleware[]): StoreEnhancer {
  return (createStore) => (reducer, preloadedState) => {
    const store = createStore(reducer, preloadedState)
    let dispatch: Dispatch = () => {
      throw new Error('Dispatching while constructing your middleware is not allowed.')
    }

    const middlewareAPI = {
      getState: store.getState.bind(store),
      dispatch: (action: AnyAction) => dispatch(action),
    }

    const chain = middlewares.map((middleware) => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch,
    }
  }
}

// Compose function for middleware chaining
function compose(...funcs: Function[]): Function {
  if (funcs.length === 0) {
    return (arg: any) => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce(
    (a, b) =>
      (...args: any[]) =>
        a(b(...args))
  )
}
