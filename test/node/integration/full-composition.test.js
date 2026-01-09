/**
 * Integration Tests - Full Composition
 * 
 * Tests the complete MElement with all mixins working together
 */

import '../../test-mocks.js'
import { describe, it, beforeEach, assertEqual, assertTrue, assertFalse, assertExists, assertUndefined } from '../../test-framework.js'
import MElement from '../../../src/index.js'

describe('MElement Integration', () => {
  let element

  beforeEach(() => {
    // Mock parsedCallback to be manually callable
    class TestElement extends MElement {
      constructor(config) {
        super(config)
      }
    }
    element = new TestElement()
  })

  it('should create an instance with default config', () => {
    assertExists(element)
    assertFalse(element.loaded)
    assertFalse(element.onError)
  })

  it('should create an instance with custom config', () => {
    class TestElement extends MElement {
      constructor() {
        super({ onLoadHtml: '<p>Loading</p>', onErrorHtml: '<p>Error</p>' })
      }
    }
    const el = new TestElement()
    assertExists(el)
  })

  it('should have all public methods', () => {
    assertExists(element.originalFragment)
    assertExists(element.originalText)
    assertExists(element.getSlotByName)
    assertExists(element.getAllSlots)
  })

  it('should have all public properties', () => {
    assertEqual(element.loaded, false)
    assertEqual(element.onError, false)
  })

  it('should handle sync init', () => {
    class TestElement extends MElement {
      init() {
        this.innerHTML = '<span>synced</span>'
      }
    }
    const el = new TestElement()
    
    let eventFired = false
    el.addEventListener('load', () => { eventFired = true })
    
    el.parsedCallback()
    
    assertTrue(eventFired)
    assertTrue(el.loaded)
    assertFalse(el.onError)
  })

  it('should handle async init', async () => {
    class TestElement extends MElement {
      async init() {
        this.innerHTML = '<span>asynced</span>'
      }
    }
    const el = new TestElement({ onLoadHtml: '<p>Loading...</p>' })
    
    let eventFired = false
    el.addEventListener('load', () => { eventFired = true })
    
    el.parsedCallback()
    
    // Should show loading HTML immediately
    assertEqual(el.innerHTML, '<p>Loading...</p>')
    
    // Wait for async
    await new Promise(resolve => setTimeout(resolve, 100))
    
    assertTrue(eventFired)
    assertTrue(el.loaded)
    assertFalse(el.onError)
    assertEqual(el.innerHTML, '<span>asynced</span>')
  })

  it('should handle errors in sync init', () => {
    class TestElement extends MElement {
      init() {
        throw new Error('Sync error')
      }
    }
    const el = new TestElement({ onErrorHtml: '<p>Error!</p>' })
    
    let eventFired = false
    el.addEventListener('load', () => { eventFired = true })
    
    el.parsedCallback()
    
    assertTrue(eventFired)
    assertTrue(el.loaded)
    assertTrue(el.onError)
    assertEqual(el.innerHTML, '<p>Error!</p>')
  })

  it('should handle errors in async init', async () => {
    class TestElement extends MElement {
      async init() {
        throw new Error('Async error')
      }
    }
    const el = new TestElement({ onErrorHtml: '<p>Async Error!</p>' })
    
    let eventFired = false
    el.addEventListener('load', () => { eventFired = true })
    
    el.parsedCallback()
    
    // Wait for async
    await new Promise(resolve => setTimeout(resolve, 100))
    
    assertTrue(eventFired)
    assertTrue(el.loaded)
    assertTrue(el.onError)
    assertEqual(el.innerHTML, '<p>Async Error!</p>')
  })

  it('should preserve and retrieve original content', () => {
    class TestElement extends MElement {
      init() {
        const text = this.originalText()
        this.innerHTML = `<div>${text}</div>`
      }
    }
    const el = new TestElement()
    
    // Add content
    const child = document.createElement('span')
    child.textContent = 'original content'
    el.appendChild(child)
    
    el.parsedCallback()
    
    assertTrue(el.loaded)
  })

  it('should handle level-up attribute', () => {
    class TestElement extends MElement {
      init() {
        this.innerHTML = '<div>Child 1</div><div>Child 2</div>'
      }
    }
    const el = new TestElement()
    el.setAttribute('level-up', '')
    
    let replaceCalled = false
    el.replaceWith = function() {
      replaceCalled = true
    }
    
    el.parsedCallback()
    
    assertTrue(replaceCalled)
    assertTrue(el.loaded)
  })

  it('should work without init method', () => {
    class TestElement extends MElement {}
    const el = new TestElement()
    
    let eventFired = false
    el.addEventListener('load', () => { eventFired = true })
    
    el.parsedCallback()
    
    assertTrue(eventFired)
    assertTrue(el.loaded)
    assertFalse(el.onError)
  })

  it('should handle slot retrieval', () => {
    const el = new MElement()
    
    // Mock slots
    const slot1 = document.createElement('slot')
    slot1.name = 'header'
    const slot2 = document.createElement('slot')
    slot2.name = 'footer'
    
    el.appendChild(slot1)
    el.appendChild(slot2)
    
    // Mock querySelectorAll
    el.querySelectorAll = () => [slot1, slot2]
    
    el.parsedCallback()
    
    const headerSlot = el.getSlotByName('header')
    assertExists(headerSlot)
    assertEqual(headerSlot.name, 'header')
    
    const footerSlot = el.getSlotByName('footer')
    assertExists(footerSlot)
    assertEqual(footerSlot.name, 'footer')
    
    const nonExistent = el.getSlotByName('sidebar')
    assertUndefined(nonExistent)
  })
})
