export function forwardRef<T, P = {}>(
  render: (props: P, ref: { current: T | null }) => any
): (props: P) => any {
  const elementType = (props: P) => {
    const ref = (elementType as any)._ref
    return render(props, ref)
  }

  ;(elementType as any).$$typeof = Symbol.for('flect.forward_ref')
  ;(elementType as any)._render = render

  return elementType
}
