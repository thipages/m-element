import HTMLParsedElement from 'html-parsed-element'
const isAsyncFunction = fn => fn.constructor.name === 'AsyncFunction'
const replace = (that) => {
    if (that.hasAttribute('level-up')) {
        console.log('level')
        that.replaceWith(...that.children)
    }
}
export default class MElement extends HTMLParsedElement {
    #config
    constructor(config = {}) {
        super()
        this.#config = config
    }
    connectedCallback() {
        if (this.parsed && this.#config.oneConnect) return
        super.connectedCallback()
    }
    parsedCallback() {
        if (this.init) {
            if (isAsyncFunction(this.init)) {
                this.init().then (
                    () => replace(this)
                )
            } else {
                this.init()
                replace(this)
            } 
        } else {
            replace(this)
        }                 
    }
}