/**
 * Compose Utility
 * 
 * Composes multiple mixins into a single class by applying them sequentially.
 * Order matters - mixins are applied from left to right.
 * 
 * @param {Class} Base - The base class to extend
 * @param {...Function} mixins - Mixin functions to apply
 * @returns {Class} The composed class
 * 
 * @example
 * const MyElement = compose(
 *   HTMLElement,
 *   MixinA,
 *   MixinB,
 *   MixinC
 * )
 */
export function compose(Base, ...mixins) {
  return mixins.reduce((AccumulatedClass, mixin) => {
    return mixin(AccumulatedClass)
  }, Base)
}
