# m-element

`MElement` class extends [HTMLParsedElement](https://github.com/WebReflection/html-parsed-element) with the following addition:
- one constructor argument
  - `{ onLoadHtml }` html used in async initialization (default ''),
- an `init` function (sync or async) called by `parsedCallback`
- a boolean `level-up` attribute for replacing the *just created* custom-element by its children.

## Usage
``` javascript
import MElement from `@titsoft/m-element`

customElements.define('a-custom-element', class extends MElement {
    constructor () {
        super() 
        // or super( { onLoadHtml: '<p>a waiting message</p>' } )
    }
    init() {}
    // or async init() {}
})

```
> - Do not call `connectedCallback` or `parsedCallback` unless you override them,
> - Use `disconnectedCallback` or `attributeChangedCallback` as usual

### level-up attribute example
``` javascript
import MElement from `@titsoft/m-element`

customElements.define('a-custom-element', class extends MElement {
    constructor () {
        super()
    }
    // or async init() {}
    init() {
        this.innerHTML = `
            <div>I will replace my transient parent</div>
            <div>This one as well</div>
        `
    }
})
```
```html
<!-- finally, this will create the two divs only -->
<a-custom-element level-up></a-custom-element>
```
