# define-custom-element

Define custom-element based on [html-parsed-element](https://github.com/WebReflection/html-parsed-element). It provides
- an unique connected/parsed call,
- usage of a sync or an async `init` function called after `parsedCallback`,
- attributes managemet through `attributes` and `attributeChanged` functions,
- a `disconnected` function

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