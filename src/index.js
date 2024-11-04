import HTMLParsedElement from 'html-parsed-element'
const isAsyncFunction = fn => fn.constructor.name === 'AsyncFunction'
const replace = (that) => {
    if (that.hasAttribute('level-up')) {
        that.replaceWith(...that.children)
    }
}
export default class MElement extends HTMLParsedElement {
    #config
    #alreadyParsed = false
    constructor(config = {}) {
        super()
        this.#config = config
    }
    connectedCallback() {
        if (this.#alreadyParsed && this.#config.oneConnect) return
        this.#alreadyParsed = true
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
        }                   
    }
}