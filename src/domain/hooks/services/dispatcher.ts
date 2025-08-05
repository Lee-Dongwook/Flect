type RenderTarget = () => void

let currentRenderTarget: RenderTarget | null = null

export function setRenderTarget(fn: RenderTarget) {
  currentRenderTarget = fn
}

export function triggerRerender() {
  currentRenderTarget?.()
}
