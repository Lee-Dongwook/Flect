export function unmountComponentAtNode(container: HTMLElement): boolean {
  if (!container) return false

  container.innerHTML = ''
  // TODO: Hook Context cleanup

  return true
}
