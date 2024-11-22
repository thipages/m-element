import MElement from '../src/index.js'
customElements.define('test-sync', class extends MElement {
    constructor() {
        super()
    }
    init() {
        this.style.display='block'
        this.innerHTML = '<span></span>'
    }
})
customElements.define('test-sync2', class extends MElement {
    constructor() {
        super()
    }
    init() {
        this.style.display='block'
        this.append(this.originalFragment())
    }
})
customElements.define('test-async', class extends MElement {
    constructor() {
        super({onLoadHtml: '<p style="color:blue">LOADING</p>'})
    }
    async init() {
        this.style.display='block'
        return new Promise(
            resolve => {
                setTimeout(
                    () => {
                        this.innerHTML = '<span>async ok</span>'
                        resolve()
                    }, this.getAttribute('delay') | 0
                )
            }
        )
    }
})
customElements.define('error-async', class extends MElement {
    constructor() {
        super({onErrorHtml: '<p style="color:red">on Error</p>'})
    }
    async init() {
        return new Promise(
            (resolve, reject) => {
                setTimeout(
                    () => {
                        //this.innerHTML = '<span>async on error</span>'
                        reject()
                    }, this.getAttribute('delay') | 0
                )
            }
        )
    }
})
const num = 6
const el = (id) => document.getElementById(id)
Array(num).fill('').map((v, i)=>'A' + (i+1)).forEach (id => el(id).addEventListener('load', loaded))
let loadedCount = 0
function loaded(e) {
    loadedCount++
    if (loadedCount === num) runTests()
    console.log(e.target.id, e.target.tagName, e.target.loaded, e.target.onError)
}

function runTests() {
    const tests = [
        A1.children[0].tagName === "SPAN",
        A2.children[0].tagName === "SPAN",
        !document.getElementById('A3'),
        !document.getElementById('A4'),
        A5.originalText() === 'a content',
        A6.onError = true,
        A7.children.length === 2
    ]
    addResults(tests)
}

function addResults(tests) {
    results.innerHTML = wrapUl(tests.map(
        (v, i) => `<li>${v ? 'ok' : 'nok'}</li>`
    ))
}
function wrapUl(array) {
    return `<ol>${array.join('')}</ol>`
}