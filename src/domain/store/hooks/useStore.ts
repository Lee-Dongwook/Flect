import { useSyncExternalStore } from '../../hooks/services/useSyncExternalStore'
import { Store, AnyAction } from '../model/types'

export function useStore<S = any, A extends AnyAction = AnyAction>(store: Store<S, A>): S {
  return useSyncExternalStore(store.subscribe, store.getState, store.getState)
}
