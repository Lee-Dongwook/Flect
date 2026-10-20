function getPrototypeOf<T>(obj: T): T extends object ? any : never;
function getPrototypeOf(obj: unknown): unknown {
  return Object.getPrototypeOf(obj);
}

export default getPrototypeOf;
