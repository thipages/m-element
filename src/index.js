/**
 * MElement - Modular Custom Element Base Class
 * 
 * A composable, mixin-based custom element foundation with:
 * - Content preservation (originalFragment, originalText)
 * - Slot management (getSlotByName, getAllSlots)
 * - Loading state (loaded property, loading HTML)
 * - Error handling (onError property, error HTML)
 * - Async/sync initialization (init lifecycle)
 * - Level-up attribute (transient wrapper)
 * 
 * @version 1.0.0
 * @license MIT
 */

import HTMLParsedElement from 'html-parsed-element'
import { compose } from './mixins/compose.js'
import { initState, initConfig } from './mixins/state-management.js'
import ContentPreservationMixin from './mixins/content-preservation.js'
import SlotUtilitiesMixin from './mixins/slot-utilities.js'
import LoadingStateMixin from './mixins/loading-state.js'
import ErrorHandlingMixin from './mixins/error-handling.js'
import AsyncInitMixin from './mixins/async-init.js'
import LevelUpMixin from './mixins/level-up.js'

/**
 * Compose all mixins in the correct order
 * Order is critical for proper functionality:
 * 1. ContentPreservationMixin - base content functionality
 * 2. SlotUtilitiesMixin - independent slot utilities
 * 3. LoadingStateMixin - loading state management
 * 4. ErrorHandlingMixin - error state management (depends on loading)
 * 5. AsyncInitMixin - lifecycle coordination (depends on error/loading)
 * 6. LevelUpMixin - level-up attribute (depends on init completion)
 */
const ComposedMElement = compose(
  HTMLParsedElement,
  ContentPreservationMixin,
  SlotUtilitiesMixin,
  LoadingStateMixin,
  ErrorHandlingMixin,
  AsyncInitMixin,
  LevelUpMixin
)

/**
 * MElement - Custom Element Base Class
 * 
 * Extends HTMLParsedElement with lifecycle management and utilities
 * 
 * @example
 * class MyElement extends MElement {
 *   constructor() {
 *     super({ onLoadHtml: 'Loading...', onErrorHtml: 'Error!' })
 *   }
 *   async init() {
 *     // Your async initialization code
 *   }
 * }
 */
export default class MElement extends ComposedMElement {
  /**
   * Constructor
   * @param {Object} config - Configuration object
   * @param {string} config.onLoadHtml - HTML to display during initialization
   * @param {string} config.onErrorHtml - HTML to display on error
   */
  constructor(config) {
    super()
    initState(this)
    initConfig(this, config || {})
    this.loaded = false
    this.onError = false
  }
}
