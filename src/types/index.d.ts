/**
 * Type definitions for @titsoft/m-element
 * @version 1.0.0
 */

declare module '@titsoft/m-element' {
  /**
   * Configuration options for MElement
   */
  export interface MElementConfig {
    /**
     * HTML to display during asynchronous initialization
     */
    onLoadHtml?: string;
    
    /**
     * HTML to display when initialization fails
     */
    onErrorHtml?: string;
  }

  /**
   * MElement - Custom Element Base Class
   * 
   * A composable, mixin-based custom element foundation with:
   * - Content preservation (originalFragment, originalText)
   * - Slot management (getSlotByName, getAllSlots)
   * - Loading state (loaded property, loading HTML)
   * - Error handling (onError property, error HTML)
   * - Async/sync initialization (init lifecycle)
   * - Level-up attribute (transient wrapper)
   */
  export default class MElement extends HTMLElement {
    /**
     * Constructor
     * @param config - Configuration object
     */
    constructor(config?: MElementConfig);

    /**
     * Indicates whether initialization has completed
     */
    loaded: boolean;

    /**
     * Indicates whether an error occurred during initialization
     */
    onError: boolean;

    /**
     * Optional initialization method
     * Can be synchronous or asynchronous
     */
    init?(): void | Promise<void>;

    /**
     * Get the original content as a DocumentFragment
     * @param remove - Whether to remove the fragment from memory (default: true)
     * @returns The original fragment or undefined if not available
     */
    originalFragment(remove?: boolean): DocumentFragment | undefined;

    /**
     * Get the original content as text
     * @param remove - Whether to remove the fragment from memory (default: true)
     * @returns The original text content or undefined if not available
     */
    originalText(remove?: boolean): string | undefined;

    /**
     * Get a slot by its name attribute
     * @param name - The name of the slot to find
     * @returns The slot element or undefined if not found
     */
    getSlotByName(name: string): HTMLSlotElement | undefined;

    /**
     * Get all slots
     * @returns All slot elements, or empty array if none
     */
    getAllSlots(): NodeList | Array<HTMLSlotElement>;

    /**
     * Called when the element is parsed
     * Do not override this method - use init() instead
     */
    parsedCallback(): void;
  }
}
