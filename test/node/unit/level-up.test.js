/**
 * Unit tests for LevelUpMixin
 */

import '../../test-mocks.js'
import { describe, it, beforeEach, assertTrue, assertFalse } from '../../test-framework.js'
import LevelUpMixin from '../../../src/mixins/level-up.js'
import { initState } from '../../../src/mixins/state-management.js'

describe('LevelUpMixin', () => {
  let TestElement, element

  beforeEach(() => {
    TestElement = LevelUpMixin(HTMLElement)
    element = new TestElement()
    initState(element)
  })

  it('should not replace when level-up attribute is not present', () => {
    let replaceCalled = false
    element.replaceWith = function() {
      replaceCalled = true
    }
    
    element._handleLevelUp()
    
    assertFalse(replaceCalled)
  })

  it('should replace when level-up attribute is present', () => {
    let replaceCalled = false
    let childrenPassed = []
    
    element.setAttribute('level-up', '')
    element.replaceWith = function(...children) {
      replaceCalled = true
      childrenPassed = children
    }
    
    // Add some children
    const child1 = document.createElement('div')
    const child2 = document.createElement('span')
    element.appendChild(child1)
    element.appendChild(child2)
    
    element._handleLevelUp()
    
    assertTrue(replaceCalled)
  })

  it('should handle element with no children', () => {
    let replaceCalled = false
    element.setAttribute('level-up', '')
    element.replaceWith = function(...children) {
      replaceCalled = true
    }
    
    // Should not throw error
    element._handleLevelUp()
    
    assertTrue(replaceCalled)
  })

  it('should handle element with single child', () => {
    let replaceCalled = false
    element.setAttribute('level-up', '')
    element.replaceWith = function(...children) {
      replaceCalled = true
    }
    
    const child = document.createElement('div')
    element.appendChild(child)
    
    element._handleLevelUp()
    
    assertTrue(replaceCalled)
  })
})
