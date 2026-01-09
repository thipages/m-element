/**
 * Unit tests for ErrorHandlingMixin
 */

import '../../test-mocks.js'
import { describe, it, beforeEach, assertEqual, assertFalse, assertTrue, assertNull, assertExists } from '../../test-framework.js'
import ErrorHandlingMixin from '../../../src/mixins/error-handling.js'
import { initState, initConfig } from '../../../src/mixins/state-management.js'

describe('ErrorHandlingMixin', () => {
  let TestElement, element

  beforeEach(() => {
    TestElement = ErrorHandlingMixin(HTMLElement)
    element = new TestElement()
    initState(element)
    initConfig(element, {})
  })

  it('should default onError to false', () => {
    assertFalse(element.onError)
  })

  it('should set onError to true', () => {
    element.onError = true
    assertTrue(element.onError)
  })

  it('should set onError to false', () => {
    element.onError = true
    element.onError = false
    assertFalse(element.onError)
  })

  it('should display empty string when no onErrorHtml config', () => {
    element._displayErrorHtml()
    assertEqual(element.innerHTML, '')
  })

  it('should display error HTML from config', () => {
    initConfig(element, { onErrorHtml: '<p>Error occurred</p>' })
    element._displayErrorHtml()
    assertEqual(element.innerHTML, '<p>Error occurred</p>')
  })

  it('should handle complex error HTML', () => {
    const errorHtml = '<div class="error"><span>An error occurred</span></div>'
    initConfig(element, { onErrorHtml: errorHtml })
    element._displayErrorHtml()
    assertEqual(element.innerHTML, errorHtml)
  })

  it('should store last error', () => {
    const error = new Error('Test error')
    element._setLastError(error)
    const lastError = element._getLastError()
    assertExists(lastError)
    assertEqual(lastError.message, 'Test error')
  })

  it('should return null when no error stored', () => {
    const lastError = element._getLastError()
    assertNull(lastError)
  })

  it('should overwrite previous error', () => {
    const error1 = new Error('First error')
    const error2 = new Error('Second error')
    
    element._setLastError(error1)
    element._setLastError(error2)
    
    const lastError = element._getLastError()
    assertEqual(lastError.message, 'Second error')
  })
})
