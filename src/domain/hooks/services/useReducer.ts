import { getCurrentFiber, getHookIndex } from '../model/hookContext'

interface Update<S> {
  action: any
  nextState: S
}

export function useReducer<S, A>(
  reducer: (state: S, action: A) => S,
  initialState: S
): [S, (action: A) => void] {
  const fiber = getCurrentFiber()
  const index = getHookIndex()

  const prevHook = fiber.alternate?.memoizedState?.[index]
  const prevState = prevHook?.memoizedState ?? initialState

  function dispatch(action: A) {
    const nextState = reducer(fiber.memoizedState![index].memoizedState, action)
    fiber.memoizedState![index].memoizedState = nextState

    fiber.pendingProps = fiber.memoizedProps

    import('../../vdom/model/workLoop').then(({ scheduleUpdateOnFiber }) => {
      scheduleUpdateOnFiber(fiber)
    })
  }

  const hook = {
    memoizedState: prevState,
    queue: [] as Update<S>[],
  }

  if (!fiber.memoizedState) fiber.memoizedState = []
  fiber.memoizedState[index] = hook

  return [hook.memoizedState, dispatch]
}
