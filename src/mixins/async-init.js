/**
 * Async Init Mixin
 * 
 * Manages the async/sync initialization lifecycle.
 * This is the core lifecycle mixin that orchestrates:
 * - Preserving original content to a fragment
 * - Removing and storing slots
 * - Displaying loading HTML
 * - Running init() method (sync or async)
 * - Handling errors
 * - Displaying error HTML on failure
 * - Dispatching 'load' event when complete
 * 
 * This mixin implements parsedCallback and coordinates with other mixins.
 */

import { getState, setState, getConfig } from './state-management.js'
import { isAsyncFunction } from '../utils/is-async-function.js'

// Error message constant
const ERROR_MESSAGE = 'MElement initialization error'

export default function AsyncInitMixin(Base) {
  return class extends Base {
    /**
     * Called when element is parsed
     * This is the main lifecycle hook
     */
    parsedCallback() {
      this._preserveContent()
      this._preserveSlots()
      this._showLoadingState()
      this._runInit()
    }

    /**
     * Preserve original childNodes to a fragment
     * @protected
     */
    _preserveContent() {
      const fragment = document.createDocumentFragment()
      fragment.append(...this.childNodes)
      setState(this, 'fragment', fragment)
    }

    /**
     * Remove and store slots
     * @protected
     */
    _preserveSlots() {
      const slots = this.querySelectorAll('slot')
      slots.forEach(slot => slot.remove())
      setState(this, 'slots', slots)
    }

    /**
     * Show loading HTML
     * @protected
     */
    _showLoadingState() {
      // Call the method from LoadingStateMixin if available
      if (this._displayLoadingHtml) {
        this._displayLoadingHtml()
      }
    }

    /**
     * Run the init method if it exists
     * @protected
     */
    _runInit() {
      if (!this.init) {
        this._finishInit()
        return
      }

      if (isAsyncFunction(this.init)) {
        this._runAsyncInit()
      } else {
        this._runSyncInit()
      }
    }

    /**
     * Run synchronous init
     * @protected
     */
    _runSyncInit() {
      try {
        this.init()
        this._finishInit()
      } catch (error) {
        this._finishInit(new Error(ERROR_MESSAGE, { cause: error }))
      }
    }

    /**
     * Run asynchronous init
     * @protected
     */
    _runAsyncInit() {
      this.init()
        .then(() => this._finishInit())
        .catch(error => {
          this._finishInit(new Error(ERROR_MESSAGE, { cause: error }))
        })
    }

    /**
     * Finish initialization
     * @protected
     * @param {Error} [error] - Error if initialization failed
     */
    _finishInit(error) {
      // Set loaded state
      this.loaded = true
      this.onError = !!error

      // Store error if present
      if (error && this._setLastError) {
        this._setLastError(error)
      }

      // Display error HTML if needed
      if (this.onError && this._displayErrorHtml) {
        this._displayErrorHtml()
      }

      // Handle level-up attribute (will be implemented in LevelUpMixin)
      if (this._handleLevelUp) {
        this._handleLevelUp()
      }

      // Dispatch load event
      this.dispatchEvent(new Event('load'))
    }
  }
}
