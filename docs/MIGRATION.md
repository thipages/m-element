# Migration Guide: v0.8.0 → v1.0.0

## Overview

MElement v1.0.0 is **100% backward compatible** with v0.8.0. All existing code will continue to work without any changes.

## What Changed?

### Internal Architecture

The monolithic class has been refactored into a modular, mixin-based architecture:

- **Before**: Single 79-line class with all functionality
- **After**: 6 focused mixins + composition layer

### API (No Changes!)

All public APIs remain identical:

```javascript
// ✅ All of this still works exactly the same
class MyElement extends MElement {
  constructor() {
    super({ onLoadHtml: 'Loading...', onErrorHtml: 'Error!' })
  }
  
  async init() {
    const text = this.originalText()
    this.innerHTML = `<div>${text}</div>`
  }
}
```

## Benefits of v1.0.0

### 1. Better Maintainability

Code is organized into focused modules, each with a single responsibility.

### 2. Better Testability

Each mixin can be tested independently with comprehensive unit tests.

### 3. Better Documentation

Clear separation of concerns makes the code self-documenting.

### 4. Foundation for Future

Modular architecture enables future enhancements without breaking changes.

### 5. Fixed Issues

Several minor issues from v0.8.0 have been fixed:
- Typo: "Atribute" → "Attribute"
- Improved `isAsyncFunction` check
- `getSlotByName` uses `find()` instead of `filter()[0]`
- Better null checks throughout
- More descriptive error messages

## Do You Need to Migrate?

**Short answer: No!**

If your code works with v0.8.0, it will work with v1.0.0 without any changes.

## Testing Your Migration

### 1. Update Package Version

```json
{
  "dependencies": {
    "@titsoft/m-element": "^1.0.0"
  }
}
```

### 2. Run Your Tests

Your existing tests should pass without modification.

### 3. Test These Scenarios

- ✅ Sync initialization
- ✅ Async initialization
- ✅ Error handling
- ✅ Loading states
- ✅ Content preservation (`originalFragment`, `originalText`)
- ✅ Slot retrieval (`getSlotByName`)
- ✅ Level-up attribute
- ✅ Load event

## New Features (Optional)

### TypeScript Support

v1.0.0 includes hand-written TypeScript definitions:

```typescript
import MElement, { MElementConfig } from '@titsoft/m-element'

class MyElement extends MElement {
  constructor() {
    const config: MElementConfig = {
      onLoadHtml: '<p>Loading...</p>',
      onErrorHtml: '<p>Error!</p>'
    }
    super(config)
  }
  
  async init(): Promise<void> {
    // TypeScript will check your types
  }
}
```

### Better Error Messages

Error messages are now more descriptive:

```javascript
// v0.8.0: "m-element error"
// v1.0.0: "MElement initialization error"
```

The original error is preserved as `cause`:

```javascript
catch (error) {
  console.error(error.message) // "MElement initialization error"
  console.error(error.cause)   // Original error
}
```

## Common Questions

### Q: Will this break my existing code?

**A:** No. v1.0.0 is 100% backward compatible.

### Q: Do I need to change my imports?

**A:** No. The import remains the same:

```javascript
import MElement from '@titsoft/m-element'
```

### Q: Are there any deprecated APIs?

**A:** No. All v0.8.0 APIs are still fully supported.

### Q: What about performance?

**A:** Performance is equivalent or better. The mixin composition happens once at class definition time.

### Q: Can I use the new mixin architecture directly?

**A:** Not yet. Custom compositions are planned for v1.1.0. For now, use the standard `MElement` class.

### Q: What if I find a bug?

**A:** Please report it on [GitHub Issues](https://github.com/thipages/m-element/issues).

## Rollback Plan

If you encounter any issues:

1. **Pin to v0.8.0**:
   ```json
   {
     "dependencies": {
       "@titsoft/m-element": "0.8.0"
     }
   }
   ```

2. **Report the issue**: Help us fix it!

## Advanced: Understanding the New Architecture

If you're curious about the internal changes, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Testing Guide

For comprehensive testing strategies, see [TESTING.md](./TESTING.md).

## Future Roadmap

### v1.1.0 (Planned)
- Expose individual mixins for custom compositions
- Additional utility mixins
- Performance optimizations

### v2.0.0 (Future)
- Potential breaking changes (will be clearly documented)
- New features based on community feedback

## Getting Help

- **Documentation**: [README.md](../README.md)
- **Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Testing**: [TESTING.md](./TESTING.md)
- **Issues**: [GitHub Issues](https://github.com/thipages/m-element/issues)

## Summary

✅ **No code changes required**  
✅ **All APIs work exactly the same**  
✅ **Better internal architecture**  
✅ **Fixed minor issues**  
✅ **Added TypeScript support**  
✅ **Zero new dependencies**  

Happy coding! 🚀
