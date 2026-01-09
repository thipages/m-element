/**
 * Slot Utilities Mixin
 * 
 * Provides utility methods for working with slots.
 * Slots are removed from the DOM and stored for later use.
 * 
 * Public API:
 * - getSlotByName(name) - Get a specific slot by name
 * - getAllSlots() - Get all slots
 */

import { getState } from './state-management.js'

export default function SlotUtilitiesMixin(Base) {
  return class extends Base {
    /**
     * Get a slot by its name attribute
     * @param {string} name - The name of the slot to find
     * @returns {HTMLSlotElement|undefined} The slot element or undefined if not found
     */
    getSlotByName(name) {
      const state = getState(this)
      const slots = state.slots
      
      // Return undefined if no slots or no name provided
      if (!slots || !name) {
        return undefined
      }
      
      // Use find() instead of filter()[0] for better readability
      return Array.from(slots).find(slot => slot.name === name)
    }

    /**
     * Get all slots
     * @returns {NodeList|Array} All slot elements, or empty array if none
     */
    getAllSlots() {
      const state = getState(this)
      return state.slots || []
    }
  }
}
