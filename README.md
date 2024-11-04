# m-element

`MElement` class extends [HTMLParsedElement](https://github.com/WebReflection/html-parsed-element) with the following addition:
- one constructor argument `oneConnect` (default false) which calls once `connectedCallback` when true,

- an `init` function (sync or async) called after `parsedCallback`

- a boolean `level-up` attribute allows replacing the *just created* custom-element by its children.

## Usage
``` javascript
import MElement from `@titsoft/m-element`

customElements.define('a-custom-element', class extends MElement {
    constructor () {
        super() // oneConnect = false
    }
    // or async init() {}
    init() {}
})

```
### level-up attribute example
``` javascript
import MElement from `@titsoft/m-element`

customElements.define('a-custom-element', class extends MElement {
    constructor () {
        super(true)
    }
    // or async init() {}
    init() {
        this.innerHTML = `
            <div>I will replace my transient parent</div>
            <div>Me as well</div>
        `
    }
})
```
```html
<!-- finally, it will create the two divs only -->
<a-custom-element level-up></a-custom-element>
```
