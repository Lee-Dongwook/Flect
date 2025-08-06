import { useContext } from '../../hooks/services/useContext'
import { createContext } from '../../hooks/services/createContext'
import { Store, Dispatch, AnyAction } from '../model/types'

// Create store context
export const StoreContext = createContext<Store<any, AnyAction> | null>(null)

export function useDispatch<S = any, A extends AnyAction = AnyAction>(): Dispatch<A> {
  const store = useContext(StoreContext)
  if (!store) {
    throw new Error('useDispatch must be used within a StoreProvider')
  }
  return store.dispatch
}
