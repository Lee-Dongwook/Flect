export interface TransitionContext {
  isPending: boolean
  startTransition: (cb: () => void) => void
}

let currentTransition: TransitionContext = {
  isPending: false,
  startTransition: () => {},
}

export function getTransitionContext(): TransitionContext {
  return currentTransition
}

export function setTransitionContext(ctx: TransitionContext) {
  currentTransition = ctx
}
