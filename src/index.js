import HTMLParsedElement from 'html-parsed-element'
const LEVEL_UP = 'level-up'
const LOADED = 'loaded'
const ON_ERROR = 'onError'
const isAsyncFunction = fn => fn.constructor.name === 'AsyncFunction'
export default class MElement extends HTMLParsedElement {
    #config
    #fragment
    constructor(config) {
        super()
        this.#config = config || {}
        this[ON_ERROR] = false
        this[LOADED] = false
    }
    #content(remove, textOnly) {
        const _ = this.#fragment
        if (!_) return
        if (remove) this.#fragment = null
        return textOnly ?  _.textContent : _
    }
    #finish (error) {
        this[LOADED] = true
        this[ON_ERROR] = !!error
        this.dispatchEvent(new Event('load'))
        if (this.hasAttribute(LEVEL_UP)) {
            this.replaceWith(...this.children)
        }
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
                this.init()
                    .then(() => end())
                    .catch(end)
            } else {
                this.init()
                end()
            } 
        } else {
            end()
        } 
    }
}