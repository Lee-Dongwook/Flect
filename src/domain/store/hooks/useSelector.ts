import { useSyncExternalStore } from '../../hooks/services/useSyncExternalStore'
import { useContext } from '../../hooks/services/useContext'
import { StoreContext } from './useDispatch'
import { Store, AnyAction } from '../model/types'

export function useSelector<S = any, A extends AnyAction = AnyAction, R = S>(
  selector: (state: S) => R,
  equalityFn?: (left: R, right: R) => boolean
): R {
  const store = useContext(StoreContext)
  if (!store) {
    throw new Error('useSelector must be used within a StoreProvider')
  }

  const getSnapshot = () => selector(store.getState())
  const subscribe = store.subscribe

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
