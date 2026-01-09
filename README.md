# m-element

[![npm version](https://img.shields.io/npm/v/@titsoft/m-element.svg)](https://www.npmjs.com/package/@titsoft/m-element)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**A modular, composable custom element base class with zero dependencies.**

`MElement` extends [HTMLParsedElement](https://github.com/WebReflection/html-parsed-element) with lifecycle management, async/sync initialization, error handling, and content preservation - all in a clean, mixin-based architecture.

## ✨ Features

- **🔄 Async/Sync Init** - Seamless support for both synchronous and asynchronous initialization
- **📦 Content Preservation** - Access original content with `originalFragment()` and `originalText()`
- **🎰 Slot Management** - Named slots with `getSlotByName()`
- **⚡ Loading States** - Display custom HTML during initialization
- **🚨 Error Handling** - Graceful error handling with custom error HTML
- **🎭 Level-up Attribute** - Transient wrapper elements that self-destruct
- **🧩 Modular Architecture** - Built with composable mixins (v1.0.0)
- **📝 TypeScript Support** - Full TypeScript definitions included
- **🔬 Well Tested** - 53+ unit tests with zero external test dependencies
- **0️⃣ Zero Dependencies** - Only `html-parsed-element` as a production dependency

## 📦 Installation

```bash
npm install @titsoft/m-element
```

## 🚀 Quick Start

```javascript
import MElement from '@titsoft/m-element'

customElements.define('my-element', class extends MElement {
  constructor() {
    super({ 
      onLoadHtml: '<p>Loading...</p>',
      onErrorHtml: '<p>Error!</p>' 
    })
  }
  
  async init() {
    // Your async initialization code
    const data = await fetch('/api/data')
    this.innerHTML = `<div>${await data.text()}</div>`
  }
})
```

```html
<my-element></my-element>
```

## 📚 API Reference

### Constructor

```javascript
constructor(config)
```

**Parameters:**
- `config.onLoadHtml` *(string, optional)* - HTML to display during initialization
- `config.onErrorHtml` *(string, optional)* - HTML to display on error

### Methods

#### `init()`
Optional lifecycle method. Can be synchronous or asynchronous.

```javascript
// Synchronous
init() {
  this.innerHTML = '<span>Ready!</span>'
}

// Asynchronous
async init() {
  const data = await fetchData()
  this.render(data)
}
```

#### `originalFragment(remove = true)`
Get original content as a DocumentFragment.

**Parameters:**
- `remove` *(boolean)* - Remove from memory after retrieval (default: true)

**Returns:** `DocumentFragment | undefined`

```javascript
init() {
  const fragment = this.originalFragment()
  this.appendChild(fragment)
}
```

#### `originalText(remove = true)`
Get original content as text.

**Parameters:**
- `remove` *(boolean)* - Remove from memory after retrieval (default: true)

**Returns:** `string | undefined`

```javascript
init() {
  const text = this.originalText()
  this.innerHTML = `<p>${text}</p>`
}
```

#### `getSlotByName(name)`
Get a specific named slot.

**Parameters:**
- `name` *(string)* - Slot name to find

**Returns:** `HTMLSlotElement | undefined`

```javascript
init() {
  const header = this.getSlotByName('header')
  if (header) {
    this.appendChild(header)
  }
}
```

#### `getAllSlots()`
Get all slots.

**Returns:** `NodeList | Array`

### Properties

#### `loaded` *(readonly)*
Boolean indicating if initialization has completed.

```javascript
element.addEventListener('load', () => {
  console.log(element.loaded) // true
})
```

#### `onError` *(readonly)*
Boolean indicating if an error occurred during initialization.

```javascript
element.addEventListener('load', () => {
  if (element.onError) {
    console.error('Initialization failed')
  }
})
```

### Events

#### `load`
Dispatched when initialization completes (success or error).

```javascript
element.addEventListener('load', (e) => {
  console.log('Element loaded', e.target.loaded, e.target.onError)
})
```

### Attributes

#### `level-up`
When present, replaces the custom element with its children after initialization.

```html
<my-element level-up>
  <div>I will replace my parent</div>
</my-element>

<!-- After initialization, becomes: -->
<div>I will replace my parent</div>
```

## 🎯 Examples

### Async Data Fetching

```javascript
customElements.define('user-profile', class extends MElement {
  constructor() {
    super({ onLoadHtml: '<div class="spinner">Loading...</div>' })
  }
  
  async init() {
    const userId = this.getAttribute('user-id')
    const response = await fetch(`/api/users/${userId}`)
    const user = await response.json()
    
    this.innerHTML = `
      <div class="profile">
        <h2>${user.name}</h2>
        <p>${user.bio}</p>
      </div>
    `
  }
})
```

### Content Transformation

```javascript
customElements.define('markdown-renderer', class extends MElement {
  async init() {
    const markdown = this.originalText()
    const html = await this.renderMarkdown(markdown)
    this.innerHTML = html
  }
  
  async renderMarkdown(md) {
    // Your markdown rendering logic
  }
})
```

### With Slots

```javascript
customElements.define('card-element', class extends MElement {
  init() {
    const header = this.getSlotByName('header')
    const footer = this.getSlotByName('footer')
    
    this.innerHTML = `
      <div class="card">
        <div class="header"></div>
        <div class="content">${this.originalText()}</div>
        <div class="footer"></div>
      </div>
    `
    
    if (header) this.querySelector('.header').appendChild(header)
    if (footer) this.querySelector('.footer').appendChild(footer)
  }
})
```

```html
<card-element>
  <slot name="header"><h2>Title</h2></slot>
  Card content here
  <slot name="footer"><button>OK</button></slot>
</card-element>
```

### Error Handling

```javascript
customElements.define('data-loader', class extends MElement {
  constructor() {
    super({ 
      onLoadHtml: '<p>Loading data...</p>',
      onErrorHtml: '<p class="error">Failed to load data</p>'
    })
  }
  
  async init() {
    const response = await fetch('/api/data')
    if (!response.ok) {
      throw new Error('Failed to fetch')
    }
    const data = await response.json()
    this.render(data)
  }
})
```

## 🏗️ Architecture (v1.0.0)

MElement v1.0.0 features a modular, mixin-based architecture:

```
MElement
 └─ ContentPreservationMixin
 └─ SlotUtilitiesMixin
 └─ LoadingStateMixin
 └─ ErrorHandlingMixin
 └─ AsyncInitMixin
 └─ LevelUpMixin
```

Each mixin provides focused functionality and can be tested independently.

For detailed architecture documentation, see [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md).

## 📖 Documentation

- **[Architecture Guide](./docs/ARCHITECTURE.md)** - Internal architecture and design decisions
- **[Migration Guide](./docs/MIGRATION.md)** - Migrating from v0.8.0 to v1.0.0 (spoiler: no changes needed!)
- **[Testing Guide](./docs/TESTING.md)** - Comprehensive testing documentation
- **[Changelog](./CHANGELOG.md)** - Version history and changes

## 🧪 Testing

MElement includes a comprehensive test suite with zero external dependencies:

```bash
# Run unit tests
npm test

# Watch mode
npm run test:watch

# Browser tests
npm run test:browser
```

**Test Coverage:** 53+ unit tests covering all mixins and integration scenarios.

See [docs/TESTING.md](./docs/TESTING.md) for detailed testing documentation.

## 🔄 Migration from v0.8.0

**Good news:** v1.0.0 is 100% backward compatible! No code changes required.

See [docs/MIGRATION.md](./docs/MIGRATION.md) for details.

## 📋 Best Practices

### ✅ Do

- Use `init()` for initialization logic
- Return promises from async `init()`
- Handle errors in `init()` gracefully
- Use `originalFragment()` / `originalText()` to preserve content
- Dispatch custom events for component communication

### ❌ Don't

- Override `parsedCallback()` (use `init()` instead)
- Override `connectedCallback()` (use standard web components lifecycle)
- Access DOM before `init()` completes
- Forget to call `super()` in constructor

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

See [docs/TESTING.md](./docs/TESTING.md) for testing guidelines.

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🙏 Credits

Built with [HTMLParsedElement](https://github.com/WebReflection/html-parsed-element) by [@WebReflection](https://github.com/WebReflection).

## 📊 Version

**Current:** 1.0.0  
**Previous:** 0.8.0  
**Node:** ^14.0.0 || ^16.0.0 || ^18.0.0 || ^20.0.0

## 🔗 Links

- [GitHub Repository](https://github.com/thipages/m-element)
- [npm Package](https://www.npmjs.com/package/@titsoft/m-element)
- [Issues](https://github.com/thipages/m-element/issues)
- [Changelog](./CHANGELOG.md)

---

Made with ❤️ by [Thierry Pagès](https://github.com/thipages)
