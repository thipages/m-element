/**
 * Unit tests for SlotUtilitiesMixin
 */

import '../../test-mocks.js'
import { describe, it, beforeEach, assertEqual, assertExists, assertUndefined } from '../../test-framework.js'
import SlotUtilitiesMixin from '../../../src/mixins/slot-utilities.js'
import { setState, initState } from '../../../src/mixins/state-management.js'

describe('SlotUtilitiesMixin', () => {
  let TestElement, element

  beforeEach(() => {
    TestElement = SlotUtilitiesMixin(HTMLElement)
    element = new TestElement()
    initState(element)
  })

  it('should return undefined when no slots exist', () => {
    const result = element.getSlotByName('test')
    assertUndefined(result)
  })

  it('should return undefined when name is not provided', () => {
    const slot = document.createElement('slot')
    slot.name = 'test'
    setState(element, 'slots', [slot])
    
    const result = element.getSlotByName()
    assertUndefined(result)
  })

  it('should return undefined when name is null', () => {
    const slot = document.createElement('slot')
    slot.name = 'test'
    setState(element, 'slots', [slot])
    
    const result = element.getSlotByName(null)
    assertUndefined(result)
  })

  it('should return the correct slot by name', () => {
    const slot1 = document.createElement('slot')
    slot1.name = 'header'
    const slot2 = document.createElement('slot')
    slot2.name = 'footer'
    
    setState(element, 'slots', [slot1, slot2])
    
    const result = element.getSlotByName('footer')
    assertExists(result)
    assertEqual(result.name, 'footer')
  })

  it('should return undefined for non-existent slot name', () => {
    const slot = document.createElement('slot')
    slot.name = 'header'
    setState(element, 'slots', [slot])
    
    const result = element.getSlotByName('footer')
    assertUndefined(result)
  })

  it('should handle multiple slots with same content', () => {
    const slot1 = document.createElement('slot')
    slot1.name = 'test'
    const slot2 = document.createElement('slot')
    slot2.name = 'test'
    
    setState(element, 'slots', [slot1, slot2])
    
    const result = element.getSlotByName('test')
    assertExists(result)
    assertEqual(result, slot1) // Should return first match
  })

  it('should return empty array when getAllSlots called with no slots', () => {
    const result = element.getAllSlots()
    assertExists(result)
    assertEqual(result.length, 0)
  })

  it('should return all slots', () => {
    const slot1 = document.createElement('slot')
    slot1.name = 'header'
    const slot2 = document.createElement('slot')
    slot2.name = 'footer'
    
    setState(element, 'slots', [slot1, slot2])
    
    const result = element.getAllSlots()
    assertEqual(result.length, 2)
  })
})
