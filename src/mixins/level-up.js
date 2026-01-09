/**
 * Level Up Mixin
 * 
 * Implements the "level-up" attribute functionality.
 * When the level-up attribute is present, the custom element
 * replaces itself with its children after initialization.
 * 
 * This allows for transient wrapper elements that disappear
 * after doing their work.
 */

const LEVEL_UP = 'level-up'

export default function LevelUpMixin(Base) {
  return class extends Base {
    /**
     * Handle level-up attribute
     * Called after initialization is complete
     * @protected
     */
    _handleLevelUp() {
      if (this.hasAttribute(LEVEL_UP)) {
        this.replaceWith(...this.children)
      }
    }
  }
}
