import MElement from './../src/index.js'
customElements.define('test-sync', class extends MElement {
    init() {
        this.innerHTML = 'Sync Ok'
    }
})
customElements.define('test-async', class extends MElement {
    async init() {
        return new Promise(
            resolve => {
                setTimeout(
                    () => {
                        this.innerHTML = 'Async Ok'
                        resolve()
                    }, 10
                )
            }
        )
    }
})
customElements.define('test-it', class extends MElement {})

setTimeout(
    () => {
        const tests = [
            A.innerHTML === "Sync Ok",
            B.innerHTML === 'Async Ok',
            C.parentElement === document.body
        ]
        addResults(tests)
    }, 1000
)

function addResults(tests) {
    results.innerHTML = tests.map(
        (v, i) => `<div>${i+1}. ${v ? 'ok' : 'nok'}</div>`
    ).join('')
}