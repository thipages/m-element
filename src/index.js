import HTMLParsedElement from 'html-parsed-element'
// Atribute
const LEVEL_UP = 'level-up'
// load/error status
const LOADED = 'loaded'
const ON_ERROR = 'onError'
// constructor config properties
const ON_LOAD_HTML = 'onLoadHtml'
const ON_ERROR_HTML = 'onErrorHtml'
// Error message for async init
const ERROR = 'm-element error'
//
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
        // Any errors will display onErrorHtml config property
        if (this[ON_ERROR]) {
            this.innerHTML = this.#config[ON_ERROR_HTML] || ''
        }
        if (this.hasAttribute(LEVEL_UP)) {
            this.replaceWith(...this.children)
        }
        // DEV: dispatchEvent runs after all changes
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
        const end = (e) => that.#finish(e)
        // move childNodes to a fragment
        this.#fragment = document.createDocumentFragment()
        this.#fragment.append(...this.childNodes)
        // display onLoadHtml
        this.innerHTML = this.#config[ON_LOAD_HTML] || ''
        // manage async/sync init function
        if (this.init) {
            if (isAsyncFunction(this.init)) {
                this.init()
                    .then(() => end())
                    .catch((e)=> {
                        end(new Error(ERROR, {cause: e}))
                    })
            } else {
                this.init()
                end()
            } 
        } else {
            end()
        } 
    }
}