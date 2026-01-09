# MElement Architecture

## Overview

MElement v1.0.0 is a complete refactoring from a monolithic class to a modular, mixin-based architecture. This document explains the architectural decisions, mixin composition, and design patterns used.

## Philosophy

1. **Zero Dependencies** - Only `html-parsed-element` as a production dependency
2. **Modular Design** - Each feature is a separate, testable mixin
3. **Backward Compatibility** - 100% compatible with v0.8.0 API
4. **Composability** - Use only what you need (future: custom compositions)
5. **Testability** - Each mixin can be tested independently

## Architecture Diagram

```
MElement
  └─ ComposedMElement (composed via mixins)
      └─ HTMLParsedElement
          ├─ ContentPreservationMixin
          ├─ SlotUtilitiesMixin
          ├─ LoadingStateMixin
          ├─ ErrorHandlingMixin
          ├─ AsyncInitMixin
          └─ LevelUpMixin
```

## Mixin System

### Why Mixins?

JavaScript classes don't support multiple inheritance. Mixins allow us to compose functionality from multiple sources:

```javascript
const MixinA = (Base) => class extends Base { /* ... */ }
const MixinB = (Base) => class extends Base { /* ... */ }

const Composed = compose(HTMLElement, MixinA, MixinB)
```

### Mixin Order (Critical!)

Mixins are applied in a specific order. The order matters because later mixins can depend on earlier ones:

1. **ContentPreservationMixin** - Base content functionality
2. **SlotUtilitiesMixin** - Independent slot utilities
3. **LoadingStateMixin** - Loading state management
4. **ErrorHandlingMixin** - Error state management (depends on loading)
5. **AsyncInitMixin** - Lifecycle coordination (depends on error/loading)
6. **LevelUpMixin** - Level-up attribute (depends on init completion)

## State Management

### Symbol-Based State

Private fields (`#field`) cannot be shared across mixins. We use Symbols for shared state:

```javascript
// src/mixins/state-management.js
export const STATE = Symbol('mElementState')
export const CONFIG = Symbol('mElementConfig')

export function getState(instance) {
  if (!instance[STATE]) {
    instance[STATE] = {
      fragment: null,
      slots: null,
      loaded: false,
      onError: false,
      lastError: null
    }
  }
  return instance[STATE]
}
```

### Why Symbols?

- **Privacy**: Not enumerable, not easily accessible
- **Collision-free**: Guaranteed unique keys
- **Shared**: Accessible across mixin boundaries
- **Type-safe**: Better than string keys

## Mixin Descriptions

### ContentPreservationMixin

**Purpose**: Preserve and retrieve original content

**API**:
- `originalFragment(remove = true)` - Get content as DocumentFragment
- `originalText(remove = true)` - Get content as text

**Implementation**: Stores original childNodes in a DocumentFragment during `parsedCallback`

### SlotUtilitiesMixin

**Purpose**: Manage named slots

**API**:
- `getSlotByName(name)` - Get specific slot by name
- `getAllSlots()` - Get all slots

**Implementation**: Removes slots from DOM and stores them in state

**Fixed Issues**:
- Uses `find()` instead of `filter()[0]`
- Proper null checks
- Returns `undefined` for missing slots (not null)

### LoadingStateMixin

**Purpose**: Manage loading state and display loading HTML

**API**:
- `loaded` (property) - Boolean indicating completion
- `_displayLoadingHtml()` (protected) - Show loading HTML

**Implementation**: Uses config.onLoadHtml during async initialization

### ErrorHandlingMixin

**Purpose**: Manage error state and display error HTML

**API**:
- `onError` (property) - Boolean indicating error
- `_displayErrorHtml()` (protected) - Show error HTML
- `_setLastError(error)` (protected) - Store error
- `_getLastError()` (protected) - Retrieve error

**Implementation**: Uses config.onErrorHtml on initialization failure

### AsyncInitMixin

**Purpose**: Orchestrate the initialization lifecycle

**Lifecycle**:
1. Preserve original content to fragment
2. Remove and store slots
3. Display loading HTML
4. Run init() method (sync or async)
5. Handle success/error
6. Display error HTML if needed
7. Call level-up handler
8. Dispatch 'load' event

**API**:
- `parsedCallback()` - Main lifecycle hook (do not override!)
- Protected methods for each step

**Async Detection**: Uses improved `isAsyncFunction()` utility

**Error Handling**: Wraps errors with descriptive message and `cause`

### LevelUpMixin

**Purpose**: Implement level-up attribute functionality

**API**:
- `_handleLevelUp()` (protected) - Replace element with children

**Implementation**: When `level-up` attribute is present, replaces the custom element with its children after initialization

## Compose Utility

```javascript
// src/mixins/compose.js
export function compose(Base, ...mixins) {
  return mixins.reduce((AccumulatedClass, mixin) => {
    return mixin(AccumulatedClass)
  }, Base)
}
```

Simple but powerful - applies mixins left-to-right in sequence.

## Testing Strategy

### Unit Tests

Each mixin has comprehensive unit tests:
- Tested independently with mock base class
- Tests all public and protected methods
- Tests edge cases and error conditions
- Uses zero-dependency test framework

### Integration Tests

Full composition tests in browser environment:
- Tests all mixins working together
- Validates backward compatibility
- Tests real DOM interactions
- Tests async behavior with real promises

### Test Framework

Custom zero-dependency test framework (`test/test-framework.js`):
- Works in both Node.js and browser
- Colored terminal output
- Simple API: `describe`, `it`, `beforeEach`, `afterEach`
- Comprehensive assertions
- ~200 lines of code

## Performance Considerations

### Memory

- State is initialized only once per instance
- Fragments can be removed from memory with `remove=true`
- Symbols have minimal overhead

### Speed

- Mixin composition happens once at class definition
- No runtime overhead compared to monolithic class
- Direct property access (no proxies)

## Future Enhancements

### Custom Compositions

Allow users to create custom element classes with only the mixins they need:

```javascript
import { compose } from '@titsoft/m-element/compose'
import { AsyncInitMixin, ErrorHandlingMixin } from '@titsoft/m-element/mixins'

const LightElement = compose(
  HTMLParsedElement,
  AsyncInitMixin,
  ErrorHandlingMixin
)
```

### Additional Mixins

Potential future mixins:
- **AttributeObservationMixin** - Reactive attribute handling
- **RenderMixin** - Template rendering
- **EventBusMixin** - Cross-component communication
- **DataBindingMixin** - Two-way data binding

### Tree-Shaking

With proper exports, bundlers can tree-shake unused mixins.

## Migration from v0.8.0

See [MIGRATION.md](./MIGRATION.md) for detailed migration guide.

## Contributing

When adding new mixins:

1. Follow the mixin pattern (see existing mixins)
2. Use state-management.js for shared state
3. Add comprehensive unit tests
4. Update documentation
5. Maintain backward compatibility
6. No new dependencies!

## License

MIT License - See LICENSE file
