import HTMLParsedElement from 'html-parsed-element'
const LEVEL_UP = 'level-up'
const isAsyncFunction = fn => fn.constructor.name === 'AsyncFunction'
export default class MElement extends HTMLParsedElement {
    #config
    #textContent
    constructor(config) {
        super()
        this.#config = config || {}
    }
    content(remove=true) {
        const _ = this.#textContent
        if (remove) this.#textContent = null
        return _
    }
    #finish (that) {
        if (that.hasAttribute(LEVEL_UP)) {
            that.replaceWith(...that.children)
        }
        that.dispatchEvent(new Event('load'))
        that.lodaed = true
    }
    parsedCallback() {
        const end = () => this.#finish(this)
        this.#textContent = this.textContent
        this.innerHTML = this.#config.onLoadHtml || ''
        if (this.init) {
            if (isAsyncFunction(this.init)) {
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