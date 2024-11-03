# define-parsed-element

Define custom-element based on [html-parsed-element](https://github.com/WebReflection/html-parsed-element). It provides in addition
- a one-time parsedCallback call,
- usage of a sync or an async `init` function called after `parsedCallback`,
- `attributes`,  `attributeChanged`, `disconnected` as shortcuts for `observedAttributes`,  `attributeChangedCallback`, `disconnectedCallback`

## Usage
``` javascript
import defineParsedElement from `@titsoft/define-parsed-element`

defineParsedElement(a-custom-element, {
    function init() {}, // or async function init()
    function attributeChanged(name, oldValue, newValue) {},
    function disconnected() {},
    attributes: []
})

```