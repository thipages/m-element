import MElement from './../src/index.js'
customElements.define('test-sync', class extends MElement {
    constructor() {
        super()
    }
    init() {
        this.innerHTML = '<span></span>'
    }
})
customElements.define('test-async', class extends MElement {
    constructor() {
        super()
    }
    async init() {
        return new Promise(
            resolve => {
                setTimeout(
                    () => {
                        this.innerHTML = '<span></span>'
                        resolve()
                    }, 10
                )
            }
        )
    }
})
customElements.define('test-it', class extends MElement {
    constructor() {
        super()
    }
})

setTimeout(
    () => {
        const tests = [
            A.children[0].tagName === "SPAN",
            B.children[0].tagName === "SPAN",
            !document.getElementById('C')
        ]
        addResults(tests)
    }, 1000
)

function addResults(tests) {
    results.innerHTML = wrapUl(tests.map(
        (v, i) => `<li>${i+1}. ${v ? 'ok' : 'nok'}</li>`
    ))
}
function wrapUl(array) {
    return `<ul>${array.join('')}</ul>`
}