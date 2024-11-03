import HTMLParsedElement from 'html-parsed-element'
const isAsyncFunction = fn => fn.constructor.name === 'AsyncFunction'
const noop = () => {}
const replace = (that) => {
    if (that.hasAttribute('level-up')) {
        that.replaceWith(...that.children)
    }
}
const props = [
    'init',
    'attributeChangedCallback',
    'disconnectedCallback'
]
export default function (name, config={}) {
    customElements.define(
        name, class extends HTMLParsedElement {
            #connected = false
            constructor() {
                super()
            }
            parsedCallback() {
                if (this.#connected) return
                this.#connected = true
                props.forEach(
                    v => {
                        if (config[v]) this[v] = config[v] || noop
                    }
                )
                if (isAsyncFunction(this.init)) {
                    this.init(this).then (
                        () => replace(this)
                    )
                } else {
                    this.init(this)
                    replace(this)
                }                    
            }
            static get observedAttributes () {
                return config.observedAttributes() || []
            }
        }
    )
}