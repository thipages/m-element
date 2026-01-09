/**
 * Content Preservation Mixin
 * 
 * Provides methods to access and retrieve the original content
 * of the custom element before initialization.
 * 
 * Public API:
 * - originalFragment(remove = true) - Get original childNodes as DocumentFragment
 * - originalText(remove = true) - Get original textContent
 */

import { getState, setState } from './state-management.js'

export default function ContentPreservationMixin(Base) {
  return class extends Base {
    /**
     * Get the original content as a DocumentFragment
     * @param {boolean} remove - Whether to remove the fragment from memory (default: true)
     * @returns {DocumentFragment|undefined} The original fragment or undefined if not available
     */
    originalFragment(remove = true) {
      return this._getContent(remove, false)
    }

    /**
     * Get the original content as text
     * @param {boolean} remove - Whether to remove the fragment from memory (default: true)
     * @returns {string|undefined} The original text content or undefined if not available
     */
    originalText(remove = true) {
      return this._getContent(remove, true)
    }

    /**
     * Internal method to get content
     * @private
     */
    _getContent(remove, textOnly) {
      const state = getState(this)
      const fragment = state.fragment
      
      if (!fragment) return undefined
      
      if (remove) {
        setState(this, 'fragment', null)
      }
      
      return textOnly ? fragment.textContent : fragment
    }
  }
}
