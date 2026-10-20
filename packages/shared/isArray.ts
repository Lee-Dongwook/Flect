function isArray<T>(v: T): v is T extends readonly any[] ? T : never;
function isArray(a: unknown): boolean {
  return Array.isArray(a);
}

export default isArray;
