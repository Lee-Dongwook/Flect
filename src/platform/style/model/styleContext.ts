export interface StyleContext {
  inserted: Set<string>
}

let currentStyleContext: StyleContext = {
  inserted: new Set(),
}

export function getStyleContext(): StyleContext {
  return currentStyleContext
}

export function resetStyleContext() {
  currentStyleContext = {
    inserted: new Set(),
  }
}
