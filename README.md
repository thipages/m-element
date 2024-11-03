# define-parsed-element

Define custom-element based on [html-parsed-element](https://github.com/WebReflection/html-parsed-element). It provides in addition
- an one-time parsedCallback call,
- usage of a sync or an async `init` function called after `parsedCallback`,
- a possible `level-up` attribute for replacing the *just created* custom-element by its children,
- `attributes`,  `attributeChanged`, `disconnected` as shortcuts for `observedAttributes`,  `attributeChangedCallback`, `disconnectedCallback`

## Usage
``` javascript
import defineParsedElement from `@titsoft/define-parsed-element`

defineParsedElement('a-custom-element', {
    function init() {}, // or async function init()
    function attributeChanged(name, oldValue, newValue) {},
    function disconnected() {},
    attributes: []
})

```

### level-up attribute example

``` javascript
import defineParsedElement from `@titsoft/define-parsed-element`

defineParsedElement('a-custom-element', {
    function init() {
        this.innerHTML = `
            <div>I will replace my transient parent</div>
            <div>Me as well</div>
        `
    }
})

```

```html
<!-- finally, it will create the two divs -->
<a-custom-element level-up></a-custom-element>
```
