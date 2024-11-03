# define-custom-element

Define custom-element based on [html-parsed-element](https://github.com/WebReflection/html-parsed-element). It provides
- an unique connected/parsed call,
- usage of a sync or an async `init` function called after `parsedCallback`,
- attributes managemet through `attributes` and `attributeChange` functions,
- a `disconnected` function

## Usage
``` javascript
import defineCustomElement from `@titsoft/define-custom-element`

defineCustomElement(a-custom-element, {
    function init() {}, // or async function init()
    function attributeChanged(name, oldValue, newValue) {},
    function disconnected() {},
    attributes: []
})

```