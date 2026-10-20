export default function hasOwn<T extends object, K extends PropertyKey>(
  obj: T,
  key: K,
): key is K extends keyof T ? K : never {
  return Object.hasOwn(obj, key);
}
