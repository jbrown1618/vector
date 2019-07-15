/**
 * Ensures at compile time that the static part of a class implements a certain interface.
 * Usage:
 *
 * @example
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
export function StaticImplements<T>(): ClassDecorator {
  // @ts-ignore
  return (constructor: T) => {}; // eslint-disable-line @typescript-eslint/no-unused-vars
}
