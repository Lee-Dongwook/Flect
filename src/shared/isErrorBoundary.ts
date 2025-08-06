export function isErrorBoundary(component: any): boolean {
  return typeof component === 'function' && component.__isErrorBoundary
}
