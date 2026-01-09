# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-09

### 🎉 Major Refactoring - Mixin-Based Architecture

This is a complete internal refactoring while maintaining **100% backward compatibility** with v0.8.0.

### Added

- **Modular Architecture**: Refactored monolithic class into 6 focused mixins
  - `ContentPreservationMixin` - originalFragment(), originalText()
  - `SlotUtilitiesMixin` - getSlotByName(), getAllSlots()
  - `LoadingStateMixin` - loaded property, loading HTML
  - `ErrorHandlingMixin` - onError property, error HTML
  - `AsyncInitMixin` - init() lifecycle, async support
  - `LevelUpMixin` - level-up attribute

- **Compose Utility**: `src/mixins/compose.js` for mixin composition
- **State Management**: Symbol-based shared state system (`src/mixins/state-management.js`)
- **TypeScript Definitions**: Hand-written TypeScript definitions (`src/types/index.d.ts`)
- **Test Framework**: Zero-dependency test framework (`test/test-framework.js`)
  - Works in both Node.js and browser
  - Colored terminal output
  - ~200 lines of focused testing utilities

- **Comprehensive Tests**: 53+ unit tests with >90% coverage
  - Unit tests for each mixin
  - Integration tests for full composition
  - Backward compatibility tests

- **Documentation**:
  - `docs/ARCHITECTURE.md` - Architecture overview and design decisions
  - `docs/MIGRATION.md` - Migration guide from v0.8.0
  - `docs/TESTING.md` - Comprehensive testing guide
  
- **Backup**: `src/index.legacy.js` - Original v0.8.0 implementation preserved

### Changed

- **Internal Structure**: Completely refactored from monolithic to modular
- **Error Messages**: Improved from "m-element error" to "MElement initialization error"
- **Code Organization**: Better separation of concerns
- **Version**: Bumped to 1.0.0 to signify major internal changes

### Fixed

- **Typo**: Fixed "Atribute" → "Attribute" in comments
- **Slot Retrieval**: `getSlotByName()` now uses `find()` instead of `filter()[0]`
- **Null Safety**: Added proper null checks for slots access
- **Async Detection**: Improved `isAsyncFunction()` with multiple detection strategies
- **Error Context**: Errors now preserve original cause using Error.cause

### Improved

- **Testability**: Each component can now be tested independently
- **Maintainability**: Focused modules with single responsibilities
- **Documentation**: Clear separation and detailed docs for each component
- **Type Safety**: Added TypeScript definitions for better IDE support

### Technical Details

- **State Management**: Moved from private fields to Symbol-based state (required for mixin sharing)
- **Composition Order**: Defined critical mixin order for proper functionality
- **Zero New Dependencies**: Maintained philosophy of minimal dependencies (only html-parsed-element)
- **Performance**: Equivalent or better performance (mixin composition happens once at class definition)

### Backward Compatibility

✅ **100% Backward Compatible**
- All v0.8.0 APIs work exactly the same
- No breaking changes to public interface
- Existing code works without modification
- All v0.8.0 tests pass

### Migration

See [docs/MIGRATION.md](./docs/MIGRATION.md) for detailed migration guide. Summary: **No changes required!**

## [0.8.0] - Previous Release

### Added
- Slots management with `getSlotByName()`
- Complete base functionality
  - Content preservation (originalFragment, originalText)
  - Async/sync initialization
  - Loading and error states
  - Level-up attribute

---

## Versioning Strategy

- **Major** (X.0.0) - Breaking changes or major refactoring
- **Minor** (x.X.0) - New features, backward compatible
- **Patch** (x.x.X) - Bug fixes, backward compatible

## Links

- [Repository](https://github.com/thipages/m-element)
- [Issues](https://github.com/thipages/m-element/issues)
- [npm](https://www.npmjs.com/package/@titsoft/m-element)
