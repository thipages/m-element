# m-element

`MElement` class extends [HTMLParsedElement](https://github.com/WebReflection/html-parsed-element) with the following addition:
- constructor argument
  - `{ onLoadHtml }` html string used in async initialization (default ''),
- methods
  - `init()` (sync or async) called by `parsedCallback`
  - `originalText(remove)` for getting the original `textContent`,
  - `originalFragment(remove)` for getting the original `childNodes` appended to a document fragment,
    - `remove` argument to delete from memory the text or fragment (default : true),
- events
  - `onload` triggers when async init finishes (sync init also)
- attributes
  - a boolean `level-up` attribute to replace the *just created* custom-element by its children.


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
> - Do not call `connectedCallback` or `parsedCallback` or override them,
> - Use `disconnectedCallback` or `attributeChangedCallback` as usual
``` html
<a-custom-element></a-custom-element>
```

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
