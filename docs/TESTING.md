# Testing Guide

## Overview

MElement v1.0.0 includes a comprehensive testing strategy with zero external dependencies.

## Test Structure

```
test/
├── test-framework.js          # Custom test framework
├── test-mocks.js              # DOM mocks for Node.js
├── node/
│   ├── unit/                  # Unit tests for each mixin
│   │   ├── content-preservation.test.js
│   │   ├── loading-state.test.js
│   │   ├── error-handling.test.js
│   │   ├── async-init.test.js
│   │   ├── slot-utilities.test.js
│   │   ├── level-up.test.js
│   │   └── compose.test.js
│   └── integration/           # Integration tests
│       └── full-composition.test.js
├── browser/                   # Browser-specific tests
└── index.html                 # Browser test runner
```

## Running Tests

### Unit Tests (Node.js)

```bash
# Run all unit tests
npm test

# Run unit tests in watch mode
npm run test:watch

# Run a specific test file
node test/node/unit/async-init.test.js
```

### Browser Tests

```bash
# Open browser test runner
npm run test:browser

# Or manually open
open test/index.html
```

## Test Framework

### Zero Dependencies

We built a custom test framework to maintain our zero-dependency philosophy:

- **Size**: ~200 lines
- **Features**: describe, it, beforeEach, afterEach, comprehensive assertions
- **Environment**: Works in both Node.js and browser
- **Output**: Colored terminal output (Node.js), console output (browser)

### API

```javascript
import { 
  describe, 
  it, 
  beforeEach, 
  afterEach,
  assertEqual,
  assertTrue,
  assertFalse,
  assertExists,
  assertNull,
  assertUndefined,
  assertThrows,
  assertAsyncThrows,
  assertDeepEqual
} from './test-framework.js'

describe('MyMixin', () => {
  let element

  beforeEach(() => {
    element = new TestElement()
  })

  it('should do something', () => {
    assertEqual(element.property, expectedValue)
  })
})
```

## Unit Testing Mixins

### Pattern

Each mixin is tested independently:

```javascript
import '../../test-mocks.js'  // DOM mocks for Node.js
import { describe, it, beforeEach, assertEqual } from '../../test-framework.js'
import MyMixin from '../../../src/mixins/my-mixin.js'
import { initState, initConfig } from '../../../src/mixins/state-management.js'

describe('MyMixin', () => {
  let TestElement, element

  beforeEach(() => {
    TestElement = MyMixin(HTMLElement)
    element = new TestElement()
    initState(element)
    initConfig(element, {})
  })

  it('should test something', () => {
    // Test mixin functionality
  })
})
```

### Best Practices

1. **Test in isolation** - Test each mixin with a minimal base class
2. **Mock dependencies** - Use state-management and mocks
3. **Test edge cases** - Null, undefined, empty values
4. **Test error conditions** - What happens when things go wrong?
5. **Test integration points** - How does the mixin interact with others?

## Integration Testing

### Full Composition Tests

Test the complete `MElement` with all mixins:

```javascript
import MElement from '../../../src/index.js'

describe('MElement Integration', () => {
  it('should work with sync init', () => {
    class TestElement extends MElement {
      init() {
        this.innerHTML = '<span>test</span>'
      }
    }
    
    const el = new TestElement()
    el.parsedCallback()
    
    assertTrue(el.loaded)
  })
})
```

### Backward Compatibility Tests

The browser tests in `test/index.html` serve as backward compatibility tests:
- Test all v0.8.0 functionality
- Ensure nothing broke in refactoring

## Test Coverage

### Current Coverage

- **ContentPreservationMixin**: 8 tests
- **SlotUtilitiesMixin**: 8 tests
- **LoadingStateMixin**: 7 tests
- **ErrorHandlingMixin**: 9 tests
- **AsyncInitMixin**: 11 tests
- **LevelUpMixin**: 4 tests
- **Compose utility**: 6 tests
- **Total**: 53 unit tests

### Coverage Areas

✅ **Functionality**: All public APIs covered  
✅ **Edge Cases**: Null, undefined, empty values  
✅ **Error Handling**: All error paths tested  
✅ **Integration**: Mixins working together  
✅ **Async Behavior**: Promise handling  
✅ **Backward Compatibility**: v0.8.0 tests pass  

## Writing Tests

### 1. Create Test File

```javascript
// test/node/unit/new-mixin.test.js
import '../../test-mocks.js'
import { describe, it, beforeEach, assertEqual } from '../../test-framework.js'
import NewMixin from '../../../src/mixins/new-mixin.js'

describe('NewMixin', () => {
  // Tests here
})
```

### 2. Use beforeEach for Setup

```javascript
let TestElement, element

beforeEach(() => {
  TestElement = NewMixin(HTMLElement)
  element = new TestElement()
  initState(element)
})
```

### 3. Write Clear Test Descriptions

```javascript
it('should return undefined when no data exists', () => {
  // Test here
})

it('should throw error when invalid input provided', () => {
  // Test here
})
```

### 4. Use Appropriate Assertions

```javascript
// Equality
assertEqual(actual, expected)
assertNotEqual(actual, unexpected)

// Boolean
assertTrue(value)
assertFalse(value)

// Existence
assertExists(value)
assertNull(value)
assertUndefined(value)

// Errors
assertThrows(() => { /* code */ })
await assertAsyncThrows(async () => { /* code */ })

// Deep equality
assertDeepEqual(obj1, obj2)
```

## DOM Mocks

For Node.js testing, we provide minimal DOM mocks:

```javascript
// test/test-mocks.js
// - MockHTMLElement
// - MockDocumentFragment
// - document.createElement
// - document.createDocumentFragment
// - Event class
```

These mocks are sufficient for unit testing but not for full DOM manipulation.

## Browser Testing

### Why Browser Tests?

- Real DOM interactions
- Actual custom element registration
- Real promise and event handling
- Tests `html-parsed-element` integration

### Running Browser Tests

1. Open `test/index.html` in a browser
2. Check console for test results
3. Visual inspection of test elements

### Browser Test Structure

```javascript
// test/index.js
customElements.define('test-element', class extends MElement {
  init() {
    // Test implementation
  }
})
```

```html
<!-- test/index.html -->
<test-element id="test1"></test-element>
```

## Debugging Tests

### Node.js

```bash
# Add console.log statements
node test/node/unit/my-test.test.js

# Use debugger
node --inspect-brk test/node/unit/my-test.test.js
```

### Browser

```javascript
// Add console.log in tests
console.log('Debug:', element, element.loaded)

// Use debugger statement
debugger
```

## Continuous Integration

### Future: GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
```

## Test-Driven Development

### TDD Workflow

1. **Write failing test** - Define expected behavior
2. **Implement feature** - Make test pass
3. **Refactor** - Improve code quality
4. **Repeat** - Continue with next feature

### Example

```javascript
// 1. Write test
it('should return slot by name', () => {
  const slot = element.getSlotByName('header')
  assertEqual(slot.name, 'header')
})

// 2. Implement (test fails)
getSlotByName(name) {
  // TODO
}

// 3. Make it pass
getSlotByName(name) {
  return this.getAllSlots().find(s => s.name === name)
}

// 4. Refactor if needed
```

## Performance Testing

### Manual Performance Tests

```javascript
// Measure initialization time
const start = performance.now()
customElements.define('perf-test', class extends MElement {
  init() {
    // Complex initialization
  }
})
const el = document.createElement('perf-test')
document.body.appendChild(el)
const end = performance.now()
console.log(`Init took ${end - start}ms`)
```

### Memory Profiling

Use Chrome DevTools:
1. Open Memory tab
2. Take heap snapshot before
3. Create many elements
4. Take heap snapshot after
5. Compare for memory leaks

## Best Practices

1. **Test behavior, not implementation** - Test what the code does, not how
2. **One assertion per test** - Keep tests focused
3. **Clear test names** - Describe what is being tested
4. **Independent tests** - Tests shouldn't depend on each other
5. **Fast tests** - Unit tests should be very fast
6. **Clean up** - Use beforeEach/afterEach to reset state
7. **Mock external dependencies** - Don't test the browser
8. **Test edge cases** - Null, undefined, empty, extreme values

## Troubleshooting

### Tests Fail in Node.js but Pass in Browser

- Likely DOM-dependent code
- Check if mocks are sufficient
- May need to run test in browser

### Async Tests Timeout

- Increase wait time
- Check promise resolution
- Verify event handlers

### Tests Pass Individually but Fail Together

- State pollution between tests
- Check beforeEach/afterEach
- Ensure tests are independent

## Contributing Tests

When contributing:

1. Write tests for all new functionality
2. Maintain existing test coverage
3. Follow the established test patterns
4. Run all tests before submitting PR
5. Document any new testing utilities

## Resources

- **Test Framework**: `test/test-framework.js`
- **Test Mocks**: `test/test-mocks.js`
- **Example Tests**: `test/node/unit/` directory
- **Integration Tests**: `test/node/integration/`
- **Browser Tests**: `test/index.html`

## Summary

✅ **Zero dependencies** - Custom test framework  
✅ **Comprehensive** - 53+ unit tests  
✅ **Fast** - Unit tests run in milliseconds  
✅ **Flexible** - Works in Node.js and browser  
✅ **Clear** - Simple, readable API  
✅ **Maintainable** - Easy to add new tests  

Happy testing! 🧪
