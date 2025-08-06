import { StoreEnhancer, DevToolsOptions, AnyAction } from '../model/types'

export function devToolsEnhancer(options: DevToolsOptions = {}): StoreEnhancer {
  return (createStore) => (reducer, preloadedState) => {
    const store = createStore(reducer, preloadedState)

    // Check if Redux DevTools Extension is available
    const extension = typeof window !== 'undefined' && (window as any).__REDUX_DEVTOOLS_EXTENSION__

    if (!extension) {
      return store
    }

    // Connect to Redux DevTools Extension
    const devTools = extension.connect({
      name: options.name || 'Flect Store',
      ...options,
    })

    // Subscribe to state changes
    let currentState = store.getState()
    store.subscribe(() => {
      const nextState = store.getState()
      if (nextState !== currentState) {
        devTools.send('DISPATCH', nextState)
        currentState = nextState
      }
    })

    // Handle DevTools messages
    devTools.subscribe((message: any) => {
      if (message.type === 'DISPATCH') {
        if (message.payload.type === 'JUMP_TO_ACTION' || message.payload.type === 'JUMP_TO_STATE') {
          // Handle time travel
          const state = JSON.parse(message.state)
          store.dispatch({ type: '@@DEVTOOLS_JUMP', payload: state } as AnyAction)
        }
      }
    })

    return store
  }
}
