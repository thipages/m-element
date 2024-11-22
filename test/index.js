import MElement from '../src/index.js'
customElements.define('test-sync', class extends MElement {
    constructor() {
        super()
    }
    init() {
        this.innerHTML = '<span></span>'
    }
})
customElements.define('test-sync2', class extends MElement {
    constructor() {
        super()
    }
    init() {
        this.append(this.originalFragment())
    }
})
customElements.define('test-async', class extends MElement {
    constructor() {
        super({onLoadHtml: '<p style="color:blue">loading</p>'})
    }
    async init() {
        return new Promise(
            resolve => {
                setTimeout(
                    () => {
                        this.innerHTML = '<span>ready</span>'
                        resolve()
                    }, this.getAttribute('delay') | 0
                )
            }
        )
    }
})
const num = 4
const el = (id) => document.getElementById(id)
Array(num).fill('').map((v, i)=>'A' + i).forEach (id => el(id).addEventListener('load', loaded))
function loaded(e) {
    console.log(e.target.tagName, e.target.loaded, e.target.onError)
}
setTimeout(
    () => {
        const tests = [
            A0.children[0].tagName === "SPAN",
            A1.children[0].tagName === "SPAN",
            !document.getElementById('A2'),
            !document.getElementById('A3'),
            A4.originalText() === 'a content',
            A5.children.length === 2
        ]
        addResults(tests)
    }, 1000
)

function addResults(tests) {
    results.innerHTML = wrapUl(tests.map(
        (v, i) => `<li>${v ? 'ok' : 'nok'}</li>`
    ))
}
function wrapUl(array) {
    return `<ol>${array.join('')}</ol>`
}