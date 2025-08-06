import { getCurrentFiber, getHookIndex } from '../model/hookContext'

export function useState<S>(initialValue: S): [S, (newState: S | ((prevState: S) => S)) => void] {
  const fiber = getCurrentFiber()
  const index = getHookIndex()

  const oldHookState = fiber.alternate?.memoizedState?.[index]
  const hookState = oldHookState ?? initialValue

  const setState = (newState: S | ((prevState: S) => S)) => {
    const nextState =
      typeof newState === 'function'
        ? (newState as (prevState: S) => S)(fiber.memoizedState![index])
        : newState

    fiber.memoizedState![index] = nextState

    fiber.pendingProps = fiber.memoizedProps
    import('../../vdom/model/workLoop').then(({ scheduleUpdateOnFiber }) => {
      scheduleUpdateOnFiber(fiber)
    })
  }

  if (!fiber.memoizedState) fiber.memoizedState = []
  fiber.memoizedState[index] = hookState

  return [hookState, setState]
}
