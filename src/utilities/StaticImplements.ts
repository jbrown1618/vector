/**
 * Ensures at compile time that the static part of a class implements a certain interface.
 * Usage:
 *
 * ```
 * interface HasFoo {
 *   foo(): Bar;
 * }
 *
 * @StaticImplements<HasFoo>()
 * class HasStaticFoo {
 *   static foo(): Bar;
 * }
 * ```
 */
export function StaticImplements<T>() {
  // @ts-ignore
  return (constructor: T) => {};
}
