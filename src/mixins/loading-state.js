/**
 * Loading State Mixin
 * 
 * Manages the loading state and displays loading HTML during initialization.
 * 
 * Public API:
 * - loaded (property) - Boolean indicating if initialization is complete
 */

import { getState, setState, getConfig } from './state-management.js'

// Config property keys
const ON_LOAD_HTML = 'onLoadHtml'

export default function LoadingStateMixin(Base) {
  return class extends Base {
    /**
     * Get the loaded state
     * @returns {boolean} True if initialization is complete
     */
    get loaded() {
      const state = getState(this)
      return state.loaded
    }

    /**
     * Set the loaded state
     * @param {boolean} value - The loaded state
     */
    set loaded(value) {
      setState(this, 'loaded', value)
    }

    /**
     * Display loading HTML
     * @protected
     */
    _displayLoadingHtml() {
      const config = getConfig(this)
      this.innerHTML = config[ON_LOAD_HTML] || ''
    }
  }
}
