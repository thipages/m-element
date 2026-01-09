/**
 * Symbol-based State Management for Mixins
 * 
 * Since private fields (#field) cannot be shared across mixins,
 * we use Symbols to create shared private state across all mixins.
 */

export const STATE = Symbol('mElementState')
export const CONFIG = Symbol('mElementConfig')

/**
 * Initialize state for an instance
 * @param {Object} instance - The element instance
 * @returns {Object} The state object
 */
export function initState(instance) {
  if (!instance[STATE]) {
    instance[STATE] = {
      fragment: null,
      slots: null,
      loaded: false,
      onError: false,
      lastError: null
    }
  }
  return instance[STATE]
}

/**
 * Get state for an instance
 * @param {Object} instance - The element instance
 * @returns {Object} The state object
 */
export function getState(instance) {
  if (!instance[STATE]) {
    initState(instance)
  }
  return instance[STATE]
}

/**
 * Set a specific state property
 * @param {Object} instance - The element instance
 * @param {string} key - The state property key
 * @param {*} value - The value to set
 */
export function setState(instance, key, value) {
  const state = getState(instance)
  state[key] = value
}

/**
 * Initialize config for an instance
 * @param {Object} instance - The element instance
 * @param {Object} config - The configuration object
 */
export function initConfig(instance, config = {}) {
  instance[CONFIG] = config
}

/**
 * Get config for an instance
 * @param {Object} instance - The element instance
 * @returns {Object} The config object
 */
export function getConfig(instance) {
  if (!instance[CONFIG]) {
    initConfig(instance)
  }
  return instance[CONFIG]
}
