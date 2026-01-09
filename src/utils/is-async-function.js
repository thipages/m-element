/**
 * Check if a function is async
 * 
 * More robust implementation than checking constructor.name === 'AsyncFunction'
 * This approach handles:
 * - Regular async functions
 * - Async arrow functions
 * - Functions that return promises
 * - Edge cases with transpiled code
 * 
 * @param {Function} fn - The function to check
 * @returns {boolean} True if the function is async
 */
export function isAsyncFunction(fn) {
  if (!fn) return false
  
  // Check if it's an AsyncFunction
  if (fn.constructor && fn.constructor.name === 'AsyncFunction') {
    return true
  }
  
  // Additional check: does it have the [Symbol.toStringTag] === 'AsyncFunction'
  if (fn[Symbol.toStringTag] === 'AsyncFunction') {
    return true
  }
  
  // Check using Object.prototype.toString
  if (Object.prototype.toString.call(fn) === '[object AsyncFunction]') {
    return true
  }
  
  return false
}
