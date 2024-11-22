import HTMLParsedElement from 'html-parsed-element'
const LEVEL_UP = 'level-up'
const LOADED = 'loaded'
const ONERROR = 'onError'
const isAsyncFunction = fn => fn.constructor.name === 'AsyncFunction'
export default class MElement extends HTMLParsedElement {
    #config
    #fragment
    constructor(config) {
        super()
        this.#config = config || {}
        this[ONERROR] = false
        this[LOADED] = false
    }
    #content(remove, textOnly) {
        const _ = this.#fragment
        if (!_) return
        if (remove) this.#fragment = null
        return textOnly ?  _.textContent : _
    }
    #finish () {
        if (this.hasAttribute(LEVEL_UP)) {
            this.replaceWith(...this.children)
        }
        this[LOADED] = true
        this.dispatchEvent(new Event('load'))
    }
    originalFragment(remove = true) {
        return this.#content(remove, false)
    }
    originalText(remove = true) {
        return this.#content(remove, true)
    }
    parsedCallback() {
        const that = this
        const end = () => that.#finish()
        // move childNodes to a fragment
        this.#fragment = document.createDocumentFragment()
        this.#fragment.append(...this.childNodes)
        // add onLoadHtml
        this.innerHTML = this.#config.onLoadHtml || ''
        // manage async/sync init function
        if (this.init) {
            if (isAsyncFunction(this.init)) {
                // TODO: error management with a onErrorHtml
                this.init().then(end)
            } else {
                this.init()
                end()
            } 
        } else {
            end()
        }   
              
    }
}