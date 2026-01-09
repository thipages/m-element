/**
 * Error Handling Mixin
 * 
 * Manages error state and displays error HTML when initialization fails.
 * 
 * Public API:
 * - onError (property) - Boolean indicating if an error occurred
 */

import { getState, setState, getConfig } from './state-management.js'

// Config property keys
const ON_ERROR_HTML = 'onErrorHtml'

export default function ErrorHandlingMixin(Base) {
  return class extends Base {
    /**
     * Get the error state
     * @returns {boolean} True if an error occurred
     */
    get onError() {
      const state = getState(this)
      return state.onError
    }

    /**
     * Set the error state
     * @param {boolean} value - The error state
     */
    set onError(value) {
      setState(this, 'onError', value)
    }

    /**
     * Display error HTML
     * @protected
     */
    _displayErrorHtml() {
      const config = getConfig(this)
      this.innerHTML = config[ON_ERROR_HTML] || ''
    }

    /**
     * Store the last error
     * @protected
     */
    _setLastError(error) {
      setState(this, 'lastError', error)
    }

    /**
     * Get the last error
     * @returns {Error|null} The last error or null
     */
    _getLastError() {
      const state = getState(this)
      return state.lastError
    }
  }
}
