let renderStack: Function[] = []

export function pushRenderContext(component: Function) {
  renderStack.push(component)
}

export function popRenderContext() {
  renderStack.pop()
}

export function isRendering(component: Function): boolean {
  return renderStack.includes(component)
}

export function getRenderStack(): Function[] {
  return [...renderStack] // 복사본 반환
}
