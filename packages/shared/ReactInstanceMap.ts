export function get(key: Record<string, any>): any {
  return key._reactInternals;
}

export function set(key: Record<string, any>, value: unknown): void {
  key._reactInternals = value;
}
