import HTMLParsedElement from 'html-parsed-element'
const isAsyncFunction = fn => fn.constructor.name === 'AsyncFunction'
const noop = () => {}
const replace = (that) => {
    if (that.hasAttribute('level-up')) {
        that.replaceWith(...that.children)
    }
}
export default function (name, config={}) {
    customElements.define(
        name, class extends HTMLParsedElement {
            #connected = false
            constructor() {
                super()
            }
            connectedCallback() {
                super.connectedCallback()
                if (config.oneConnect) {
                    if (this.#connected) return
                    this.#connected = true
                }
            }
            parsedCallback() {
                this.init = config.init || noop
                if (isAsyncFunction(this.init)) {
                    this.init().then (
                        () => replace(this)
                    )
                } else {
                    this.init()
                    replace(this)
                }                    
            }
            attributeChangedCallback(...args) {
                const _ = config.attributeChanged
                if (_) _.call(this, ...args)
            }
            disconnectedCallback(...args) {
                const _ = config.disconnected
                if (_) _.call(this, ...args)
            }
            static get observedAttributes () {
                return config.attributes || []
            }
        }
    )
}