/**
 * Unit tests for ContentPreservationMixin
 */

import '../../test-mocks.js'
import { describe, it, beforeEach, assertEqual, assertExists, assertUndefined } from '../../test-framework.js'
import ContentPreservationMixin from '../../../src/mixins/content-preservation.js'
import { getState, setState, initState } from '../../../src/mixins/state-management.js'

describe('ContentPreservationMixin', () => {
  let TestElement, element

  beforeEach(() => {
    TestElement = ContentPreservationMixin(HTMLElement)
    element = new TestElement()
    initState(element)
  })

  it('should return undefined when no fragment exists', () => {
    const result = element.originalFragment()
    assertUndefined(result)
  })

  it('should return undefined for text when no fragment exists', () => {
    const result = element.originalText()
    assertUndefined(result)
  })

  it('should return the original fragment', () => {
    const fragment = document.createDocumentFragment()
    const div = document.createElement('div')
    div.textContent = 'test content'
    fragment.appendChild(div)
    
    setState(element, 'fragment', fragment)
    
    const result = element.originalFragment(false)
    assertExists(result)
    assertEqual(result.children.length, 1)
  })

  it('should return the original text content', () => {
    const fragment = document.createDocumentFragment()
    const div = document.createElement('div')
    div.textContent = 'test content'
    fragment.appendChild(div)
    
    setState(element, 'fragment', fragment)
    
    const result = element.originalText(false)
    assertEqual(result, 'test content')
  })

  it('should remove fragment when remove=true (default)', () => {
    const fragment = document.createDocumentFragment()
    setState(element, 'fragment', fragment)
    
    element.originalFragment() // remove=true by default
    
    const state = getState(element)
    assertEqual(state.fragment, null)
  })

  it('should not remove fragment when remove=false', () => {
    const fragment = document.createDocumentFragment()
    setState(element, 'fragment', fragment)
    
    element.originalFragment(false)
    
    const state = getState(element)
    assertExists(state.fragment)
  })

  it('should remove fragment with originalText when remove=true', () => {
    const fragment = document.createDocumentFragment()
    const div = document.createElement('div')
    div.textContent = 'test'
    fragment.appendChild(div)
    setState(element, 'fragment', fragment)
    
    element.originalText() // remove=true by default
    
    const state = getState(element)
    assertEqual(state.fragment, null)
  })

  it('should not remove fragment with originalText when remove=false', () => {
    const fragment = document.createDocumentFragment()
    const div = document.createElement('div')
    div.textContent = 'test'
    fragment.appendChild(div)
    setState(element, 'fragment', fragment)
    
    element.originalText(false)
    
    const state = getState(element)
    assertExists(state.fragment)
  })
})
