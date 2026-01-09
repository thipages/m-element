/**
 * Unit tests for compose utility
 */

import '../../test-mocks.js'
import { describe, it, assertEqual, assertTrue, assertExists } from '../../test-framework.js'
import { compose } from '../../../src/mixins/compose.js'

describe('compose', () => {
  it('should compose a single mixin', () => {
    const MixinA = (Base) => class extends Base {
      methodA() { return 'A' }
    }
    
    const ComposedClass = compose(HTMLElement, MixinA)
    const instance = new ComposedClass()
    
    assertEqual(instance.methodA(), 'A')
  })

  it('should compose multiple mixins in order', () => {
    const MixinA = (Base) => class extends Base {
      method() { return 'A' }
    }
    
    const MixinB = (Base) => class extends Base {
      method() { return super.method ? super.method() + 'B' : 'B' }
    }
    
    const MixinC = (Base) => class extends Base {
      method() { return super.method ? super.method() + 'C' : 'C' }
    }
    
    const ComposedClass = compose(HTMLElement, MixinA, MixinB, MixinC)
    const instance = new ComposedClass()
    
    assertEqual(instance.method(), 'ABC')
  })

  it('should compose with no mixins', () => {
    const ComposedClass = compose(HTMLElement)
    const instance = new ComposedClass()
    
    assertExists(instance)
    assertTrue(instance instanceof HTMLElement)
  })

  it('should maintain inheritance chain', () => {
    const MixinA = (Base) => class extends Base {}
    const MixinB = (Base) => class extends Base {}
    
    const ComposedClass = compose(HTMLElement, MixinA, MixinB)
    const instance = new ComposedClass()
    
    assertTrue(instance instanceof HTMLElement)
  })

  it('should allow mixins to add properties', () => {
    const MixinA = (Base) => class extends Base {
      get propertyA() { return 'valueA' }
    }
    
    const MixinB = (Base) => class extends Base {
      get propertyB() { return 'valueB' }
    }
    
    const ComposedClass = compose(HTMLElement, MixinA, MixinB)
    const instance = new ComposedClass()
    
    assertEqual(instance.propertyA, 'valueA')
    assertEqual(instance.propertyB, 'valueB')
  })

  it('should allow mixins to override methods', () => {
    const MixinA = (Base) => class extends Base {
      method() { return 'original' }
    }
    
    const MixinB = (Base) => class extends Base {
      method() { return 'overridden' }
    }
    
    const ComposedClass = compose(HTMLElement, MixinA, MixinB)
    const instance = new ComposedClass()
    
    assertEqual(instance.method(), 'overridden')
  })
})
