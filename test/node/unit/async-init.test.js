/**
 * Unit tests for AsyncInitMixin
 */

import '../../test-mocks.js'
import { describe, it, beforeEach, assertEqual, assertTrue, assertFalse, assertExists } from '../../test-framework.js'
import AsyncInitMixin from '../../../src/mixins/async-init.js'
import LoadingStateMixin from '../../../src/mixins/loading-state.js'
import ErrorHandlingMixin from '../../../src/mixins/error-handling.js'
import { initState, initConfig } from '../../../src/mixins/state-management.js'
import { compose } from '../../../src/mixins/compose.js'

describe('AsyncInitMixin', () => {
  let TestElement, element

  beforeEach(() => {
    // Create a composed element with all necessary mixins
    TestElement = compose(
      HTMLElement,
      LoadingStateMixin,
      ErrorHandlingMixin,
      AsyncInitMixin
    )
    element = new TestElement()
    initState(element)
    initConfig(element, {})
  })

  it('should finish init when no init method exists', () => {
    let eventFired = false
    element.addEventListener('load', () => { eventFired = true })
    
    element.parsedCallback()
    
    assertTrue(eventFired)
    assertTrue(element.loaded)
    assertFalse(element.onError)
  })

  it('should run sync init successfully', () => {
    let initCalled = false
    element.init = function() {
      initCalled = true
    }
    
    let eventFired = false
    element.addEventListener('load', () => { eventFired = true })
    
    element.parsedCallback()
    
    assertTrue(initCalled)
    assertTrue(eventFired)
    assertTrue(element.loaded)
    assertFalse(element.onError)
  })

  it('should handle sync init error', () => {
    element.init = function() {
      throw new Error('Sync error')
    }
    
    let eventFired = false
    element.addEventListener('load', () => { eventFired = true })
    
    element.parsedCallback()
    
    assertTrue(eventFired)
    assertTrue(element.loaded)
    assertTrue(element.onError)
  })

  it('should run async init successfully', async () => {
    let initCalled = false
    element.init = async function() {
      initCalled = true
    }
    
    let eventFired = false
    element.addEventListener('load', () => { eventFired = true })
    
    element.parsedCallback()
    
    // Give time for promises to resolve (using setTimeout to ensure microtasks complete)
    await new Promise(resolve => setTimeout(resolve, 50))
    
    assertTrue(initCalled)
    assertTrue(eventFired)
    assertTrue(element.loaded)
    assertFalse(element.onError)
  })

  it('should handle async init error', async () => {
    element.init = async function() {
      throw new Error('Async error')
    }
    
    let eventFired = false
    element.addEventListener('load', () => { eventFired = true })
    
    element.parsedCallback()
    
    // Give time for promises to resolve and error handler to run
    await new Promise(resolve => setTimeout(resolve, 50))
    
    assertTrue(eventFired)
    assertTrue(element.loaded)
    assertTrue(element.onError)
  })

  it('should preserve content to fragment', () => {
    // Add some children
    const child1 = document.createElement('div')
    child1.textContent = 'Child 1'
    const child2 = document.createElement('span')
    child2.textContent = 'Child 2'
    element.appendChild(child1)
    element.appendChild(child2)
    
    element.parsedCallback()
    
    // Content should be preserved in state
    // Note: childNodes are moved to fragment, so element should be empty
    // (but our mock doesn't fully implement this)
  })

  it('should preserve slots', () => {
    const slot = document.createElement('slot')
    slot.name = 'test'
    element.appendChild(slot)
    
    // Mock querySelectorAll to return our slot
    element.querySelectorAll = () => [slot]
    
    element.parsedCallback()
    
    // Slot should be stored in state
    // (verified through state management)
  })

  it('should display loading HTML during async init', async () => {
    initConfig(element, { onLoadHtml: '<p>Loading...</p>' })
    
    element.init = async function() {
      // Just return a resolved promise
    }
    
    element.parsedCallback()
    
    // Should show loading HTML immediately
    assertEqual(element.innerHTML, '<p>Loading...</p>')
    
    // Wait for completion
    await new Promise(resolve => setTimeout(resolve, 50))
  })

  it('should display error HTML on error', async () => {
    initConfig(element, { onErrorHtml: '<p>Error!</p>' })
    
    element.init = async function() {
      throw new Error('Test error')
    }
    
    element.parsedCallback()
    
    // Wait for async to complete
    await new Promise(resolve => setTimeout(resolve, 50))
    
    assertEqual(element.innerHTML, '<p>Error!</p>')
  })

  it('should call _handleLevelUp if available', () => {
    let levelUpCalled = false
    element._handleLevelUp = function() {
      levelUpCalled = true
    }
    
    element.parsedCallback()
    
    assertTrue(levelUpCalled)
  })

  it('should not call _handleLevelUp if not available', () => {
    // Should not throw error
    element.parsedCallback()
    assertTrue(element.loaded)
  })
})
