/**
 * Unit tests for LoadingStateMixin
 */

import '../../test-mocks.js'
import { describe, it, beforeEach, assertEqual, assertFalse, assertTrue } from '../../test-framework.js'
import LoadingStateMixin from '../../../src/mixins/loading-state.js'
import { initState, initConfig } from '../../../src/mixins/state-management.js'

describe('LoadingStateMixin', () => {
  let TestElement, element

  beforeEach(() => {
    TestElement = LoadingStateMixin(HTMLElement)
    element = new TestElement()
    initState(element)
    initConfig(element, {})
  })

  it('should default loaded to false', () => {
    assertFalse(element.loaded)
  })

  it('should set loaded to true', () => {
    element.loaded = true
    assertTrue(element.loaded)
  })

  it('should set loaded to false', () => {
    element.loaded = true
    element.loaded = false
    assertFalse(element.loaded)
  })

  it('should display empty string when no onLoadHtml config', () => {
    element._displayLoadingHtml()
    assertEqual(element.innerHTML, '')
  })

  it('should display loading HTML from config', () => {
    initConfig(element, { onLoadHtml: '<p>Loading...</p>' })
    element._displayLoadingHtml()
    assertEqual(element.innerHTML, '<p>Loading...</p>')
  })

  it('should handle complex loading HTML', () => {
    const loadingHtml = '<div class="spinner"><span>Loading</span></div>'
    initConfig(element, { onLoadHtml: loadingHtml })
    element._displayLoadingHtml()
    assertEqual(element.innerHTML, loadingHtml)
  })

  it('should handle empty string in config', () => {
    initConfig(element, { onLoadHtml: '' })
    element._displayLoadingHtml()
    assertEqual(element.innerHTML, '')
  })
})
